// Supabase Edge Function — runs daily via pg_cron.
// Queries products expiring soon per user and sends FCM push notifications.
//
// Required secrets (set via `supabase secrets set`):
//   FIREBASE_SERVICE_ACCOUNT  — Firebase service account JSON (stringified)
//
// Automatic Supabase secrets (available in every Edge Function):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface ServiceAccount {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
}

interface ExpiryStats {
  today: number;
  thisWeek: number;
  thisMonth: number;
}

// ── Google service-account JWT → FCM access token ─────────────

function pemToBuffer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s+/g, "");
  const binary = atob(b64);
  const buf = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) buf[i] = binary.charCodeAt(i);
  return buf.buffer;
}

function bufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function toBase64Url(str: string): string {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

async function getFcmAccessToken(sa: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = toBase64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = toBase64Url(
    JSON.stringify({
      iss: sa.client_email,
      scope: "https://www.googleapis.com/auth/firebase.messaging",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }),
  );

  const toSign = `${header}.${claim}`;
  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToBuffer(sa.private_key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(toSign));
  const jwt = `${toSign}.${bufferToBase64Url(sig)}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  const { access_token } = (await res.json()) as { access_token: string };
  return access_token;
}

// ── FCM send ──────────────────────────────────────────────────

async function sendFcmNotification(
  token: string,
  title: string,
  body: string,
  projectId: string,
  accessToken: string,
): Promise<boolean> {
  const res = await fetch(
    `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        message: {
          token,
          notification: { title, body },
          webpush: {
            notification: {
              title,
              body,
              icon: "/foodsense-icon-192.png",
              badge: "/foodsense-icon-192.png",
            },
          },
        },
      }),
    },
  );
  return res.ok;
}

// ── Notification text ─────────────────────────────────────────

function buildNotificationText(stats: ExpiryStats): { title: string; body: string } | null {
  if (stats.thisMonth === 0) return null;

  const parts: string[] = [];
  if (stats.today > 0) {
    parts.push(
      stats.today === 1 ? "1 vence hoy" : `${stats.today} vencen hoy`,
    );
  }

  let body: string;
  if (stats.thisWeek === 0) {
    body = `Tenés ${stats.thisMonth} ${stats.thisMonth === 1 ? "producto" : "productos"} por vencer este mes.`;
  } else if (stats.today === 0) {
    body =
      `Tenés ${stats.thisMonth} ${stats.thisMonth === 1 ? "producto" : "productos"} por vencer este mes, ` +
      `en total ${stats.thisWeek} esta semana.`;
  } else {
    body =
      `Tenés ${stats.thisMonth} ${stats.thisMonth === 1 ? "producto" : "productos"} por vencer este mes, ` +
      `en total ${stats.thisWeek} esta semana` +
      (parts.length ? ` de ${parts.length === 1 ? "los que" : "los que"} ${parts.join(" y ")}.` : ".");
  }

  return { title: "FoodSense — alerta de vencimientos", body };
}

// ── Main handler ──────────────────────────────────────────────

Deno.serve(async () => {
  const serviceAccountRaw = Deno.env.get("FIREBASE_SERVICE_ACCOUNT");
  if (!serviceAccountRaw) {
    return new Response("Missing FIREBASE_SERVICE_ACCOUNT secret", { status: 500 });
  }

  const sa = JSON.parse(serviceAccountRaw) as ServiceAccount;
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // ── 1. Find users with expiring products ──────────────────

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().slice(0, 10);

  const weekEnd = new Date(today);
  weekEnd.setDate(today.getDate() + 7);
  const weekEndStr = weekEnd.toISOString().slice(0, 10);

  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const monthEndStr = monthEnd.toISOString().slice(0, 10);

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("user_id, expires_at")
    .lte("expires_at", monthEndStr)
    .gte("expires_at", todayStr);

  if (productsError) {
    console.error("Error querying products:", productsError);
    return new Response("Error querying products", { status: 500 });
  }

  // Group stats by user
  const statsByUser = new Map<string, ExpiryStats>();
  for (const row of products ?? []) {
    const uid: string = row.user_id;
    const exp: string = row.expires_at;
    if (!statsByUser.has(uid)) statsByUser.set(uid, { today: 0, thisWeek: 0, thisMonth: 0 });
    const s = statsByUser.get(uid)!;
    s.thisMonth++;
    if (exp <= weekEndStr) s.thisWeek++;
    if (exp === todayStr) s.today++;
  }

  if (statsByUser.size === 0) {
    return new Response(JSON.stringify({ sent: 0, skipped: "no expiring products" }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // ── 2. Get enabled tokens for those users ─────────────────

  const userIds = [...statsByUser.keys()];
  const { data: tokens, error: tokensError } = await supabase
    .from("notification_tokens")
    .select("user_id, token")
    .eq("enabled", true)
    .in("user_id", userIds);

  if (tokensError) {
    console.error("Error querying tokens:", tokensError);
    return new Response("Error querying tokens", { status: 500 });
  }

  if (!tokens || tokens.length === 0) {
    return new Response(JSON.stringify({ sent: 0, skipped: "no enabled tokens" }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // ── 3. Get FCM access token & send ───────────────────────

  const accessToken = await getFcmAccessToken(sa);
  let sent = 0;
  let failed = 0;

  for (const { user_id, token } of tokens) {
    const stats = statsByUser.get(user_id);
    if (!stats) continue;

    const notification = buildNotificationText(stats);
    if (!notification) continue;

    const ok = await sendFcmNotification(
      token,
      notification.title,
      notification.body,
      sa.project_id,
      accessToken,
    );

    if (ok) sent++;
    else failed++;
  }

  console.log(`Expiry notifications: sent=${sent} failed=${failed}`);
  return new Response(JSON.stringify({ sent, failed }), {
    headers: { "Content-Type": "application/json" },
  });
});
