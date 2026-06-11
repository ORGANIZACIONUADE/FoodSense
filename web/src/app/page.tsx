"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { DaysPill } from "@/components/product/days-pill";
import { Icon } from "@/components/icons/icon";
import { countUrgent } from "@/lib/inventory";
import { useInventory } from "@/lib/use-inventory";
import { useRequireAuth } from "@/lib/use-require-auth";

const URGENCY_BANDS = [
  { label: "Urgente",  maxDays: 1,  fg: "#D85B4A", bg: "#FADDD6" },
  { label: "Pronto",   maxDays: 4,  fg: "#E89F4D", bg: "#FBE9D2" },
  { label: "A tiempo", maxDays: Infinity, fg: "#2F8F5C", bg: "#E5F1E8" },
] as const;

function classifyUrgency(days: number) {
  if (days <= 1) return 0;
  if (days <= 4) return 1;
  return 2;
}

export default function HomePage() {
  const session = useRequireAuth();
  const { products, consumedThisMonth, wastedThisMonth } = useInventory();

  if (!session) return null;

  const urgentCount = countUrgent(products);
  const topUrgent = products.slice(0, 5);
  const firstName = session.nombre.split(" ")[0];

  const bandCounts = [0, 0, 0];
  products.forEach((p) => { bandCounts[classifyUrgency(p.daysUntilExpiry)]++; });
  const total = products.length || 1;

  return (
    <AppShell active="home">
      <div className="px-[18px] pt-[max(1rem,env(safe-area-inset-top))] pb-8 lg:px-0 lg:pt-0">

        {/* Saludo */}
        <div className="mb-6">
          <p className="text-[13px] font-medium text-ink-mute">Buenos días</p>
          <h1 className="text-[28px] font-bold leading-tight tracking-tight lg:text-[34px]">
            {firstName}
          </h1>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">

          {/* Columna izquierda */}
          <div className="flex flex-col gap-5">

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-mute">En despensa</p>
                <p className="mt-1 text-[32px] font-bold leading-none text-ink">{products.length}</p>
                <p className="mt-1 text-[12px] text-ink-soft">productos</p>
              </div>

              <div
                className="rounded-2xl border p-4 shadow-sm"
                style={urgentCount > 0
                  ? { backgroundColor: "#FDEEEA", borderColor: "#FADDD6" }
                  : { backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: urgentCount > 0 ? "#D85B4A" : "var(--color-ink-mute)" }}>
                  Requieren atención
                </p>
                <p className="mt-1 text-[32px] font-bold leading-none"
                  style={{ color: urgentCount > 0 ? "#D85B4A" : "var(--color-ink)" }}>
                  {urgentCount}
                </p>
                <p className="mt-1 text-[12px]"
                  style={{ color: urgentCount > 0 ? "#D85B4A" : "var(--color-ink-soft)" }}>
                  {urgentCount === 1 ? "producto" : "productos"}
                </p>
              </div>
            </div>

            {/* Aprovechados / Desperdiciados este mes */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: "#E5F1E8" }}>
                  <Icon name="check" size={18} color="#2F8F5C" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-mute">Aprovechados</p>
                  <p className="mt-0.5 text-[24px] font-bold leading-none text-ink">{consumedThisMonth}</p>
                  <p className="text-[11px] text-ink-soft">este mes</p>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: "#FADDD6" }}>
                  <Icon name="x" size={18} color="#D85B4A" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-mute">Desperdiciados</p>
                  <p className="mt-0.5 text-[24px] font-bold leading-none text-ink">{wastedThisMonth}</p>
                  <p className="text-[11px] text-ink-soft">este mes</p>
                </div>
              </div>
            </div>

            {/* Acciones rápidas */}
            <div className="flex flex-col gap-3">
              <Link
                href="/despensa"
                className="flex h-[52px] items-center justify-between rounded-[16px] bg-green px-5 text-[15px] font-semibold text-white shadow-sm"
              >
                Ver despensa
                <Icon name="chevronLeft" size={18} color="#fff" strokeWidth={2} className="rotate-180" />
              </Link>
              <Link
                href="/agregar"
                className="flex h-[52px] items-center justify-between rounded-[16px] border border-border bg-surface px-5 text-[15px] font-semibold text-ink shadow-sm"
              >
                Agregar producto
                <Icon name="plus" size={18} color="#2F8F5C" strokeWidth={2} />
              </Link>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="mt-5 flex flex-col gap-5 lg:mt-0">

            {/* Distribución por urgencia */}
            <section className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
              <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-ink-mute">
                Estado del inventario
              </h2>
              <div className="flex flex-col gap-3">
                {URGENCY_BANDS.map((band, i) => {
                  const count = bandCounts[i];
                  const pct = Math.round((count / total) * 100);
                  return (
                    <div key={band.label} className="flex items-center gap-3">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: band.fg }}
                      />
                      <span className="w-20 text-[13px] font-medium text-ink">{band.label}</span>
                      <div className="flex-1 overflow-hidden rounded-full bg-border-soft" style={{ height: 6 }}>
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, backgroundColor: band.fg, opacity: 0.8 }}
                        />
                      </div>
                      <span className="w-5 text-right font-mono text-[12px] font-semibold text-ink-mute">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Próximos a vencer */}
            {topUrgent.length > 0 && (
              <section>
                <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-ink-mute">
                  Próximos a vencer
                </h2>
                <div className="rounded-2xl border border-border bg-surface shadow-sm overflow-hidden">
                  {topUrgent.map((product, i) => (
                    <div
                      key={product.id}
                      className={`flex items-center justify-between px-4 py-3.5 ${i < topUrgent.length - 1 ? "border-b border-border-soft" : ""}`}
                    >
                      <span className="text-[14px] font-semibold text-ink truncate mr-3">
                        {product.name}
                      </span>
                      <DaysPill days={product.daysUntilExpiry} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

        </div>
      </div>
    </AppShell>
  );
}
