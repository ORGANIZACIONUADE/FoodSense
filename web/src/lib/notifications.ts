"use client";

import type { Messaging } from "firebase/messaging";
import type { Session } from "./auth";
import { supabase } from "./supabase-client";

const ENABLED_KEY = "foodsense-notifications-enabled";
const TOKEN_KEY = "foodsense-fcm-token";
const SW_PATH = "/firebase-messaging-sw.js";
const SW_READY_TIMEOUT_MS = 10000;
const GET_TOKEN_TIMEOUT_MS = 20000;

export type NotificationStatus =
  | "unsupported"
  | "missing-config"
  | "default"
  | "granted"
  | "denied"
  | "enabled"
  | "error";

export type NotificationSettings = {
  status: NotificationStatus;
  enabled: boolean;
  token?: string;
  error?: string;
};

function canUseNotifications(): boolean {
  return (
    typeof window !== "undefined" &&
    window.isSecureContext &&
    "Notification" in window &&
    "serviceWorker" in navigator &&
    "PushManager" in window
  );
}

export function getVapidKey(): string {
  return process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY?.trim() ?? "";
}

export function areExpiryNotificationsEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ENABLED_KEY) === "true";
}

function setExpiryNotificationsEnabled(enabled: boolean): void {
  localStorage.setItem(ENABLED_KEY, String(enabled));
}

async function getClientMessaging(): Promise<Messaging | null> {
  if (!canUseNotifications()) return null;
  const { getMessaging, isSupported } = await import("firebase/messaging");
  const supported = await isSupported();
  if (!supported) return null;
  const { app } = await import("./firebase");
  return getMessaging(app);
}

async function saveNotificationToken(session: Session, token: string, enabled: boolean): Promise<void> {
  await supabase
    .from("notification_tokens")
    .upsert(
      { user_id: session.uid, token, enabled, user_agent: navigator.userAgent },
      { onConflict: "user_id,token" },
    );
}

async function getReadyServiceWorker(): Promise<ServiceWorkerRegistration> {
  const registration = await navigator.serviceWorker.register(SW_PATH, { scope: "/" });
  if (registration.active) return registration;

  return Promise.race([
    navigator.serviceWorker.ready,
    new Promise<ServiceWorkerRegistration>((_, reject) => {
      window.setTimeout(
        () => reject(new Error("El service worker no se activó a tiempo. Recargá la página e intentá de nuevo.")),
        SW_READY_TIMEOUT_MS,
      );
    }),
  ]);
}

export async function getNotificationSettings(): Promise<NotificationSettings> {
  if (!canUseNotifications()) return { status: "unsupported", enabled: false };
  if (!getVapidKey()) return { status: "missing-config", enabled: false };

  const enabled = areExpiryNotificationsEnabled();
  const token = localStorage.getItem(TOKEN_KEY) ?? undefined;
  const permission = Notification.permission;

  if (permission === "denied") return { status: "denied", enabled: false };
  if (enabled && permission === "granted") return { status: "enabled", enabled: true, token };
  if (permission === "granted") return { status: "granted", enabled: false, token };
  return { status: "default", enabled: false };
}

export async function enableNotifications(session: Session): Promise<NotificationSettings> {
  console.log("[notifications] enableNotifications start");

  if (!canUseNotifications()) {
    console.warn("[notifications] canUseNotifications=false");
    return {
      status: "unsupported",
      enabled: false,
      error: "Las notificaciones push requieren Chrome/Edge/Firefox en HTTPS o localhost.",
    };
  }

  const vapidKey = getVapidKey();
  console.log("[notifications] vapidKey present:", !!vapidKey);
  if (!vapidKey) return { status: "missing-config", enabled: false };

  const permission = await Notification.requestPermission();
  console.log("[notifications] permission:", permission);
  if (permission === "denied") return { status: "denied", enabled: false };
  if (permission !== "granted") return { status: "default", enabled: false };

  const messaging = await getClientMessaging();
  console.log("[notifications] messaging:", !!messaging);
  if (!messaging) return { status: "unsupported", enabled: false };

  try {
    console.log("[notifications] registering service worker...");
    const registration = await getReadyServiceWorker();
    console.log("[notifications] SW ready, state:", registration.active?.state);

    const { getToken } = await import("firebase/messaging");
    console.log("[notifications] calling getToken (timeout: %dms)...", GET_TOKEN_TIMEOUT_MS);

    const token = await Promise.race([
      getToken(messaging, { vapidKey, serviceWorkerRegistration: registration }),
      new Promise<never>((_, reject) =>
        window.setTimeout(
          () => reject(new Error(`getToken tardó más de ${GET_TOKEN_TIMEOUT_MS / 1000}s. Verificá la VAPID key y que el service worker esté activo.`)),
          GET_TOKEN_TIMEOUT_MS,
        ),
      ),
    ]);

    console.log("[notifications] token obtained:", !!token);

    if (!token) {
      return {
        status: "error",
        enabled: false,
        error: "No se pudo generar el token de notificaciones.",
      };
    }

    localStorage.setItem(TOKEN_KEY, token);
    setExpiryNotificationsEnabled(true);
    console.log("[notifications] saving token to Firestore + Supabase...");
    await saveNotificationToken(session, token, true);
    console.log("[notifications] done, status: enabled");
    return { status: "enabled", enabled: true, token };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al activar notificaciones.";
    console.error("[notifications] error:", message);

    const isPushUnavailable =
      message.toLowerCase().includes("push service not available") ||
      message.toLowerCase().includes("registration failed") ||
      message.toLowerCase().includes("no push service");

    return {
      status: isPushUnavailable ? "unsupported" : "error",
      enabled: false,
      error: isPushUnavailable
        ? "El navegador no tiene un servicio push disponible. Probá desde Chrome o Edge en HTTPS."
        : message,
    };
  }
}

export async function disableNotifications(session: Session): Promise<NotificationSettings> {
  const token = localStorage.getItem(TOKEN_KEY);
  setExpiryNotificationsEnabled(false);

  if (token) {
    try {
      await saveNotificationToken(session, token, false);
    } catch {}
  }

  const current = await getNotificationSettings();
  return { ...current, enabled: false, status: current.status === "enabled" ? "granted" : current.status };
}
