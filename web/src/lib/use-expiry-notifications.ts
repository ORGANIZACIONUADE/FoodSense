"use client";

import { useEffect, useState } from "react";
import type { Session } from "./auth";
import { areExpiryNotificationsEnabled } from "./notifications";
import type { Product } from "./types";

const SEEN_KEY = "foodsense-expiry-notifications";

type SeenMap = Record<string, boolean>;

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadSeen(): SeenMap {
  try {
    return JSON.parse(localStorage.getItem(SEEN_KEY) ?? "{}") as SeenMap;
  } catch {
    return {};
  }
}

function saveSeen(seen: SeenMap): void {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify(seen));
  } catch {}
}

function notificationText(product: Product): { title: string; body: string } {
  if (product.daysUntilExpiry <= 0) {
    return {
      title: `${product.name} vence hoy`,
      body: "Revisá tu despensa para consumirlo o actualizar su estado.",
    };
  }

  return {
    title: `${product.name} vence mañana`,
    body: "Tenelo presente para evitar desperdicios.",
  };
}

export function useExpiryNotifications(products: Product[], session: Session | null) {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (!areExpiryNotificationsEnabled() || Notification.permission !== "granted") return;

    const urgent = products.find((product) => product.daysUntilExpiry <= 1);
    if (!urgent) return;

    const key = `${session.uid}:${todayKey()}:${urgent.id}`;
    const seen = loadSeen();
    if (seen[key]) return;

    const { title, body } = notificationText(urgent);
    seen[key] = true;
    saveSeen(seen);

    if (document.visibilityState === "visible") {
      window.setTimeout(() => setMessage(`${title}. ${body}`), 0);
    }

    try {
      new Notification(title, {
        body,
        tag: `foodsense-expiry-${urgent.id}`,
        icon: "/foodsense-icon-192.png",
      });
    } catch {}
  }, [products, session]);

  return { message, dismiss: () => setMessage(null) };
}
