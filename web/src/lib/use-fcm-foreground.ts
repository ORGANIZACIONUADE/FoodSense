"use client";

import { useEffect } from "react";
import { areExpiryNotificationsEnabled } from "./notifications";

// Shows FCM push notifications when the app is in the foreground.
// (Firebase suppresses them by default; the SW only handles background.)
export function useFcmForeground() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!areExpiryNotificationsEnabled()) return;
    if (Notification.permission !== "granted") return;

    let unsubscribe: (() => void) | undefined;

    (async () => {
      const { getMessaging, isSupported, onMessage } = await import("firebase/messaging");
      const supported = await isSupported();
      if (!supported) return;

      const { app } = await import("./firebase");
      const messaging = getMessaging(app);

      unsubscribe = onMessage(messaging, (payload) => {
        console.log("[fcm] foreground message received:", payload);
        const title = payload.notification?.title ?? "FoodSense";
        const body = payload.notification?.body ?? "Tenés productos por vencer.";

        if ("serviceWorker" in navigator) {
          navigator.serviceWorker.getRegistration("/").then((reg) => {
            if (reg) {
              reg.showNotification(title, {
                body,
                icon: "/foodsense-icon-192.png",
                tag: "foodsense-fcm-foreground",
              });
            } else {
              new Notification(title, { body, icon: "/foodsense-icon-192.png" });
            }
          });
        } else {
          new Notification(title, { body, icon: "/foodsense-icon-192.png" });
        }
      });
    })();

    return () => unsubscribe?.();
  }, []);
}
