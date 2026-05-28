"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons/icon";
import { DaysPill } from "@/components/product/days-pill";
import { CATEGORIES } from "@/lib/categories";
import { useInventory } from "@/lib/use-inventory";
import type { CategoryKey, ProductState } from "@/lib/types";

const STATE_OPTIONS: { id: ProductState; label: string; icon: string }[] = [
  { id: "cerrado", label: "Cerrado", icon: "closed" },
  { id: "abierto", label: "Abierto", icon: "open" },
  { id: "congelado", label: "Congelado", icon: "snow" },
];

const QUICK_PRESETS = [
  { label: "Hoy", days: 0 },
  { label: "3 días", days: 3 },
  { label: "1 sem", days: 7 },
  { label: "2 sem", days: 14 },
  { label: "1 mes", days: 30 },
];

function addDaysToToday(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function dateToDays(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(dateStr + "T00:00:00");
  return Math.round((expiry.getTime() - today.getTime()) / 86_400_000);
}

function formatDateLabel(dateStr: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function AddProductForm() {
  const router = useRouter();
  const { addProduct } = useInventory();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<CategoryKey>("lacteos");
  const [state, setState] = useState<ProductState>("cerrado");
  const [expiryDate, setExpiryDate] = useState(addDaysToToday(7));
  const [nameError, setNameError] = useState(false);

  const daysUntilExpiry = dateToDays(expiryDate);
  const dateLabel = formatDateLabel(expiryDate);

  function handlePreset(days: number) {
    setExpiryDate(addDaysToToday(days));
  }

  function handleSubmit() {
    if (!name.trim()) {
      setNameError(true);
      return;
    }
    addProduct({
      id: Date.now().toString(),
      name: name.trim(),
      category,
      state,
      daysUntilExpiry,
    });
    router.push("/despensa");
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      {/* Top bar */}
      <header className="flex items-center justify-between px-[18px] pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Cancelar y volver"
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-surface-alt"
        >
          <Icon name="x" size={20} color="currentColor" />
        </button>
        <h1 className="text-[15px] font-bold tracking-tight">
          Agregar producto
        </h1>
        {/* Espacio visual derecho (scan llega en otro sprint) */}
        <div className="h-10 w-10" />
      </header>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-28">
        {/* Intro */}
        <div className="px-[22px] pb-5 pt-2">
          <p className="text-[22px] font-bold leading-snug tracking-tight">
            Contanos qué guardás
          </p>
          <p className="mt-1.5 text-[13.5px] leading-[1.45] text-ink-soft">
            Lo de siempre alcanza — nombre y fecha. El resto lo sugerimos
            nosotros.
          </p>
        </div>

        {/* Nombre */}
        <FormSection label="Nombre del producto">
          <div
            className={`flex h-[52px] items-center gap-2 rounded-xl border px-4 bg-surface text-[15px] font-semibold transition-shadow ${
              nameError
                ? "border-red shadow-[0_0_0_4px_#FDEEEA]"
                : name
                  ? "border-green shadow-[0_0_0_4px_#F2F8F3]"
                  : "border-border"
            }`}
          >
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value) setNameError(false);
              }}
              placeholder="Ej: Yogur natural"
              className="flex-1 bg-transparent text-ink placeholder:text-ink-mute focus:outline-none"
              autoFocus
              maxLength={60}
            />
          </div>
          {nameError && (
            <p className="mt-1.5 text-[12px] text-red">
              Ingresá el nombre del producto
            </p>
          )}
        </FormSection>

        {/* Categoría */}
        <FormSection label="Categoría" hint="Tocá para elegir otra">
          <div className="-mx-[18px] flex gap-2 overflow-x-auto px-[18px] pb-1 scrollbar-none">
            {(Object.entries(CATEGORIES) as [CategoryKey, typeof CATEGORIES[CategoryKey]][]).map(
              ([key, cat]) => {
                const isSelected = category === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setCategory(key)}
                    className="flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2.5 transition-colors"
                    style={{
                      background: isSelected ? cat.tint : "#fff",
                      borderColor: isSelected ? cat.stroke : "#E7E6E0",
                      borderWidth: "1.5px",
                    }}
                  >
                    <Icon
                      name={cat.icon}
                      size={18}
                      color={cat.stroke}
                      strokeWidth={1.75}
                    />
                    <span
                      className="text-[13px]"
                      style={{ fontWeight: isSelected ? 700 : 600, color: "#1B221F" }}
                    >
                      {cat.label}
                    </span>
                  </button>
                );
              },
            )}
          </div>
        </FormSection>

        {/* Estado */}
        <FormSection label="Estado">
          <div className="flex rounded-xl border border-border bg-surface-alt p-1">
            {STATE_OPTIONS.map((opt) => {
              const isActive = state === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setState(opt.id)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-[10px] py-2.5 text-[13px] transition-all ${
                    isActive
                      ? "border border-border bg-surface font-bold text-ink shadow-sm"
                      : "font-medium text-ink-soft"
                  }`}
                >
                  <Icon
                    name={opt.icon}
                    size={14}
                    color={isActive ? "#1B221F" : "#5C6460"}
                    strokeWidth={2}
                  />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </FormSection>

        {/* Fecha de vencimiento */}
        <FormSection label="Fecha de vencimiento" hint="Sugerencia: 7 días">
          {/* Quick presets */}
          <div className="mb-2.5 flex gap-1.5">
            {QUICK_PRESETS.map((p) => {
              const targetDate = addDaysToToday(p.days);
              const isActive = expiryDate === targetDate;
              return (
                <button
                  key={p.days}
                  type="button"
                  onClick={() => handlePreset(p.days)}
                  className={`flex-1 rounded-xl border py-2.5 text-[12.5px] transition-colors ${
                    isActive
                      ? "border-green bg-green font-bold text-white"
                      : "border-border bg-surface font-semibold text-ink hover:border-green/50"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Date display + native input */}
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3.5">
            <Icon name="calendar" size={20} color="#5C6460" />
            <div className="flex-1">
              <p className="font-mono text-[10px] uppercase tracking-[1.3px] text-ink-mute">
                Vence
              </p>
              <p className="mt-0.5 text-[15px] font-bold capitalize">
                {dateLabel}
              </p>
            </div>
            <DaysPill days={daysUntilExpiry} />
            {/* Native date input visually hidden but tappable over the whole row */}
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="absolute opacity-0"
              style={{ width: 1, height: 1 }}
              tabIndex={-1}
            />
          </label>
        </FormSection>
      </div>

      {/* Sticky save button */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-surface px-[18px] pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 shadow-lg lg:absolute">
        <button
          type="button"
          onClick={handleSubmit}
          className="flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-green text-[15px] font-bold text-white shadow-md transition-opacity active:opacity-80"
        >
          <Icon name="check" size={18} color="#fff" strokeWidth={2.5} />
          Agregar a despensa
        </button>
      </div>
    </div>
  );
}

function FormSection({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-[18px] pb-5">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[1.3px] text-ink-soft">
          {label}
        </span>
        {hint && <span className="text-[11.5px] text-ink-mute">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
