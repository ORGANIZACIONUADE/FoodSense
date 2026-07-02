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

interface ExpiryStats {
  today: number;
  thisWeek: number;
  thisMonth: number;
}

function computeStats(products: Product[]): ExpiryStats {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate() + 1;

  return products.reduce(
    (acc, p) => {
      if (p.daysUntilExpiry < 0 || p.daysUntilExpiry >= daysInMonth) return acc;
      acc.thisMonth++;
      if (p.daysUntilExpiry <= 7) acc.thisWeek++;
      if (p.daysUntilExpiry === 0) acc.today++;
      return acc;
    },
    { today: 0, thisWeek: 0, thisMonth: 0 },
  );
}

function buildSummaryText(stats: ExpiryStats): { title: string; body: string } | null {
  if (stats.thisMonth === 0) return null;

  const title = "FoodSense — alerta de vencimientos";
  let body: string;
  const prod = (n: number) => (n === 1 ? "producto" : "productos");

  if (stats.thisWeek === 0) {
    body = `Tenés ${stats.thisMonth} ${prod(stats.thisMonth)} por vencer este mes.`;
  } else if (stats.today === 0) {
    body =
      `Tenés ${stats.thisMonth} ${prod(stats.thisMonth)} por vencer este mes, ` +
      `en total ${stats.thisWeek} esta semana.`;
  } else {
    body =
      `Tenés ${stats.thisMonth} ${prod(stats.thisMonth)} por vencer este mes, ` +
      `en total ${stats.thisWeek} esta semana` +
      ` de los que ${stats.today === 1 ? "1 vence" : `${stats.today} vencen`} hoy.`;
  }

  return { title, body };
}

export function useExpiryNotifications(products: Product[], session: Session | null) {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (!areExpiryNotificationsEnabled() || Notification.permission !== "granted") return;

    const stats = computeStats(products);
    if (stats.thisMonth === 0) return;

    const key = `${session.uid}:${todayKey()}:summary`;
    const seen = loadSeen();
    if (seen[key]) return;

    const notification = buildSummaryText(stats);
    if (!notification) return;

    seen[key] = true;
    saveSeen(seen);

    if (document.visibilityState === "visible") {
      window.setTimeout(() => setMessage(notification.body), 0);
    }

    try {
      new Notification(notification.title, {
        body: notification.body,
        tag: "foodsense-expiry-summary",
        icon: "/foodsense-icon-192.png",
      });
    } catch {}
  }, [products, session]);

  return { message, dismiss: () => setMessage(null) };
}
