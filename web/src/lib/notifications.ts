"use client";

import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import type { Messaging } from "firebase/messaging";
import type { Session } from "./auth";
import { db } from "./firebase";

const ENABLED_KEY = "foodsense-notifications-enabled";
const TOKEN_KEY = "foodsense-fcm-token";
const SW_PATH = "/firebase-messaging-sw.js";
const SW_READY_TIMEOUT_MS = 10000;

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

function isIOSDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (
    navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1
  );
}

function isStandaloneApp(): boolean {
  if (typeof window === "undefined") return false;
  const navigatorWithStandalone = navigator as Navigator & { standalone?: boolean };
  return window.matchMedia("(display-mode: standalone)").matches || navigatorWithStandalone.standalone === true;
}

function getUnsupportedMessage(): string {
  if (typeof window === "undefined") return "Las notificaciones no están disponibles en este entorno.";

  if (!window.isSecureContext) {
    return "Las notificaciones requieren HTTPS. En desarrollo usá localhost; en iPhone abrí la URL HTTPS.";
  }

  if (isIOSDevice() && !isStandaloneApp()) {
    return "En iPhone, Chrome activa notificaciones solo si FoodSense está en la pantalla de inicio. Tocá Compartir, Agregar a pantalla de inicio, abrí FoodSense desde ese icono y volvé a activar.";
  }

  if (!("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) {
    return "Este navegador no expone las APIs de notificaciones push para esta instalación.";
  }

  return "Las notificaciones push no están disponibles en este navegador.";
}

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

function normalizeTokenId(token: string): string {
  return token.replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 140);
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
  const tokenId = `${session.uid}_${normalizeTokenId(token)}`;
  await setDoc(
    doc(db, "notificationTokens", tokenId),
    {
      uid: session.uid,
      email: session.email,
      token,
      enabled,
      userAgent: navigator.userAgent,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    },
    { merge: true },
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
  if (!canUseNotifications()) return { status: "unsupported", enabled: false, error: getUnsupportedMessage() };
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
  if (!canUseNotifications()) {
    return {
      status: "unsupported",
      enabled: false,
      error: getUnsupportedMessage(),
    };
  }
  const vapidKey = getVapidKey();
  if (!vapidKey) return { status: "missing-config", enabled: false };

  const permission = await Notification.requestPermission();
  if (permission === "denied") return { status: "denied", enabled: false };
  if (permission !== "granted") return { status: "default", enabled: false };

  const messaging = await getClientMessaging();
  if (!messaging) return { status: "unsupported", enabled: false, error: getUnsupportedMessage() };

  try {
    const registration = await getReadyServiceWorker();
    const { getToken } = await import("firebase/messaging");
    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      return {
        status: "error",
        enabled: false,
        error: "No se pudo generar el token de notificaciones.",
      };
    }

    localStorage.setItem(TOKEN_KEY, token);
    setExpiryNotificationsEnabled(true);
    await saveNotificationToken(session, token, true);
    return { status: "enabled", enabled: true, token };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al activar notificaciones.";
    const isPushUnavailable =
      message.toLowerCase().includes("push service not available") ||
      message.toLowerCase().includes("registration failed");

    return {
      status: isPushUnavailable ? "unsupported" : "error",
      enabled: false,
      error: isPushUnavailable
        ? getUnsupportedMessage()
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
