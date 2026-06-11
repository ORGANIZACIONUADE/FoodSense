"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Icon } from "@/components/icons/icon";
import { DaysPill } from "@/components/product/days-pill";
import { useNotificationSettings } from "@/lib/use-notification-settings";
import { useInventory } from "@/lib/use-inventory";
import { useRequireAuth } from "@/lib/use-require-auth";
import type { Product } from "@/lib/types";

type AlertTone = "critical" | "warning" | "info";

type PantryAlert = {
  id: string;
  product: Product;
  title: string;
  detail: string;
  tone: AlertTone;
};

const TONE_STYLES: Record<AlertTone, { bg: string; border: string; iconBg: string; iconColor: string }> = {
  critical: {
    bg: "bg-red-wash",
    border: "border-red-soft",
    iconBg: "bg-red-soft",
    iconColor: "#D85B4A",
  },
  warning: {
    bg: "bg-amber-wash",
    border: "border-amber-soft",
    iconBg: "bg-amber-soft",
    iconColor: "#B8772D",
  },
  info: {
    bg: "bg-surface",
    border: "border-border",
    iconBg: "bg-green-soft",
    iconColor: "#2F8F5C",
  },
};

function buildAlerts(products: Product[]): PantryAlert[] {
  return products
    .filter((product) => product.daysUntilExpiry <= 4)
    .map((product) => {
      if (product.daysUntilExpiry <= 0) {
        return {
          id: `expired-${product.id}`,
          product,
          title: `${product.name} vence hoy`,
          detail: "Revisalo cuanto antes para consumirlo o actualizar su estado.",
          tone: "critical",
        };
      }

      if (product.daysUntilExpiry === 1) {
        return {
          id: `tomorrow-${product.id}`,
          product,
          title: `${product.name} vence mañana`,
          detail: "Tenelo presente para evitar desperdicios.",
          tone: "warning",
        };
      }

      return {
        id: `soon-${product.id}`,
        product,
        title: `${product.name} vence pronto`,
        detail: "Está dentro de los próximos días de atención.",
        tone: "info",
      };
    });
}

export default function AlertasPage() {
  const session = useRequireAuth();
  const { products } = useInventory();
  const { settings, loading, saving, enable, disable } = useNotificationSettings(session);

  if (!session) return null;

  const alerts = buildAlerts(products);
  const urgentCount = alerts.filter((alert) => alert.product.daysUntilExpiry <= 1).length;
  const notificationCopy = {
    unsupported: settings.error ?? "Este navegador no soporta notificaciones web.",
    "missing-config": "Falta configurar NEXT_PUBLIC_FIREBASE_VAPID_KEY.",
    default: "Activá las notificaciones para recibir avisos de vencimiento.",
    granted: "El permiso está concedido, pero los avisos están pausados.",
    denied: "El navegador bloqueó las notificaciones. Habilitalas desde la configuración del sitio.",
    enabled: "Las notificaciones están activas en este dispositivo.",
    error: settings.error ?? "No se pudieron configurar las notificaciones.",
  }[settings.status];

  return (
    <AppShell active="alerts">
      <div className="px-[18px] pb-8 pt-[max(1rem,env(safe-area-inset-top))] lg:px-0 lg:pt-0">
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[26px] font-bold leading-none tracking-tight lg:text-[32px]">
              Alertas
            </h1>
            <p className="mt-1 text-[12.5px] text-ink-soft lg:text-sm">
              {urgentCount > 0
                ? `${urgentCount} notificaciones requieren atención`
                : "Sin vencimientos críticos"}
            </p>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-wash text-green">
            <Icon name="bell" size={22} color="#2F8F5C" />
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[minmax(280px,360px)_1fr] lg:items-start">
          <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-[13px] font-semibold uppercase tracking-wider text-ink-mute">
                  Push
                </h2>
                <p className="mt-1 text-sm text-ink-soft">{notificationCopy}</p>
              </div>
              <span className={`flex h-10 w-10 items-center justify-center rounded-full ${settings.enabled ? "bg-green-soft" : "bg-surface-alt"}`}>
                <Icon
                  name="bell"
                  size={19}
                  color={settings.enabled ? "#1F6B43" : "#9AA09C"}
                />
              </span>
            </div>

            {settings.status === "denied" || settings.status === "unsupported" || settings.status === "missing-config" ? (
              <div className="rounded-xl border border-border-soft bg-surface-alt px-4 py-3 text-sm font-medium text-ink-soft">
                {notificationCopy}
              </div>
            ) : settings.enabled ? (
              <button
                type="button"
                onClick={disable}
                disabled={saving || loading}
                className="h-[52px] w-full rounded-[16px] border border-border bg-bg text-[15px] font-semibold text-ink-soft transition-colors hover:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Guardando..." : "Pausar notificaciones"}
              </button>
            ) : (
              <button
                type="button"
                onClick={enable}
                disabled={saving || loading}
                className="h-[52px] w-full rounded-[16px] bg-green text-[15px] font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving || loading ? "Configurando..." : "Activar notificaciones"}
              </button>
            )}
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-[13px] font-semibold uppercase tracking-wider text-ink-mute">
                Notificaciones
              </h2>
              <span className="font-mono text-[11px] font-semibold text-ink-mute">
                {alerts.length}
              </span>
            </div>

            {alerts.length > 0 ? (
              <ol className="flex list-none flex-col gap-3">
                {alerts.map((alert) => {
                  const tone = TONE_STYLES[alert.tone];
                  return (
                    <li
                      key={alert.id}
                      className={`rounded-2xl border ${tone.border} ${tone.bg} p-4 shadow-sm`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone.iconBg}`}>
                          <Icon name="bell" size={18} color={tone.iconColor} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="mb-1.5 flex items-start justify-between gap-3">
                            <p className="text-[15px] font-bold leading-snug text-ink">
                              {alert.title}
                            </p>
                            <DaysPill days={alert.product.daysUntilExpiry} />
                          </div>
                          <p className="text-sm text-ink-soft">{alert.detail}</p>
                          <Link
                            href="/despensa"
                            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-green-deep"
                          >
                            Ver en despensa
                            <Icon name="chevronLeft" size={15} color="#1F6B43" className="rotate-180" />
                          </Link>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <div className="rounded-2xl border border-border bg-surface p-6 text-center shadow-sm">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-wash">
                  <Icon name="check" size={22} color="#2F8F5C" strokeWidth={2.4} />
                </div>
                <p className="text-base font-bold text-ink">No hay alertas pendientes</p>
                <p className="mt-1 text-sm text-ink-soft">
                  Cuando haya productos por vencer, van a aparecer en este listado.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </AppShell>
  );
}
