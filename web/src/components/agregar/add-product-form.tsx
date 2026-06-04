"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons/icon";
import { CameraScanner } from "./camera-scanner";
import { DaysPill } from "@/components/product/days-pill";
import { CATEGORIES } from "@/lib/categories";
import { useInventory } from "@/lib/use-inventory";
import type { CategoryKey, ProductState } from "@/lib/types";
import { BarcodeScanner } from "./barcode-scanner";
import type { BarcodeScanResult } from "./barcode-scanner";
import { CategoryIcon } from "@/components/product/category-icon";

const STATE_OPTIONS: { id: ProductState; label: string; icon: string }[] = [
  { id: "cerrado", label: "Cerrado", icon: "closed" },
  { id: "abierto", label: "Abierto", icon: "open" },
  { id: "congelado", label: "Congelado", icon: "snow" },
];

const STATE_LABELS: Record<ProductState, string> = {
  cerrado: "Cerrado",
  abierto: "Abierto",
  congelado: "Congelado",
};

const QUICK_PRESETS = [
  { label: "Hoy", days: 0 },
  { label: "3 días", days: 3 },
  { label: "1 semana", days: 7 },
  { label: "2 semanas", days: 14 },
  { label: "1 mes", days: 30 },
];

const DEFAULT_EXPIRY_BY_CATEGORY_AND_STATE: Record<
  CategoryKey,
  Record<ProductState, number>
> = {
  lacteos: { cerrado: 7, abierto: 7, congelado: 30 },
  carnes: { cerrado: 3, abierto: 3, congelado: 30 },
  verduras: { cerrado: 7, abierto: 3, congelado: 30 },
  frutas: { cerrado: 7, abierto: 3, congelado: 30 },
  panificados: { cerrado: 7, abierto: 3, congelado: 30 },
  bebidas: { cerrado: 30, abierto: 7, congelado: 30 },
  huevos: { cerrado: 14, abierto: 7, congelado: 30 },
  conservas: { cerrado: 30, abierto: 14, congelado: 30 },
};

const DEFAULT_STATE_BY_CATEGORY: Record<CategoryKey, ProductState> = {
  lacteos: "abierto",
  carnes: "congelado",
  verduras: "cerrado",
  frutas: "cerrado",
  panificados: "cerrado",
  bebidas: "cerrado",
  huevos: "cerrado",
  conservas: "cerrado",
};

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

function getSuggestedExpiryDays(
  category: CategoryKey,
  currentState: ProductState,
): number {
  return DEFAULT_EXPIRY_BY_CATEGORY_AND_STATE[category][currentState];
}

function getSuggestedState(category: CategoryKey): ProductState {
  return DEFAULT_STATE_BY_CATEGORY[category];
}

function formatExpiryHint(days: number): string {
  if (days === 0) return "Sugerencia: hoy";
  if (days === 3) return "Sugerencia: 3 días";
  if (days === 7) return "Sugerencia: 1 semana";
  if (days === 14) return "Sugerencia: 2 semanas";
  if (days === 30) return "Sugerencia: 1 mes";
  return `Sugerencia: ${days} días`;
}

function formatStateHint(state: ProductState): string {
  return `Sugerencia: ${STATE_LABELS[state]}`;
}

function inferCategoryFromName(name: string): CategoryKey | null {
  const s = name.toLowerCase();
  if (/leche|queso|yogur|manteca|crema|lacteo/.test(s)) return "lacteos";
  if (/carne|pollo|cerdo|pescado|hamburguesa|salchicha/.test(s)) return "carnes";
  if (/lechuga|tomate|cebolla|papa|zanahoria|verdura|zapallo/.test(s)) return "verduras";
  if (/manzana|banana|naranja|pera|uva|fruta/.test(s)) return "frutas";
  if (/pan|galletita|factura|torta|budin|harina/.test(s)) return "panificados";
  if (/agua|jugo|gaseosa|coca|sprite|cerveza|vino|bebida/.test(s)) return "bebidas";
  if (/huevo/.test(s)) return "huevos";
  if (/lata|arroz|fideo|salsa|arveja|choclo|lenteja|conserva/.test(s)) return "conservas";
  return null;
}

type SessionItem = {
  id: string;
  name: string;
  category: CategoryKey;
  state: ProductState;
  daysUntilExpiry: number;
  quantity: number;
};

export function AddProductForm() {
  const router = useRouter();
  const { addProduct, updateProduct } = useInventory();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<CategoryKey>("lacteos");
  const [state, setState] = useState<ProductState>(getSuggestedState("lacteos"));
  const [expiryDate, setExpiryDate] = useState(
    addDaysToToday(getSuggestedExpiryDays("lacteos", "abierto")),
  );
  const [expiryWasCustomized, setExpiryWasCustomized] = useState(false);
  const [stateWasCustomized, setStateWasCustomized] = useState(false);
  const [hasManuallyChangedCategory, setHasManuallyChangedCategory] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [sessionProducts, setSessionProducts] = useState<SessionItem[]>([]);
  const [sessionExpanded, setSessionExpanded] = useState(false);

  const daysUntilExpiry = dateToDays(expiryDate);
  const dateLabel = formatDateLabel(expiryDate);
  const dateHint = formatExpiryHint(getSuggestedExpiryDays(category, state));
  const stateHint = formatStateHint(getSuggestedState(category));

  function handlePreset(days: number) {
    setExpiryWasCustomized(true);
    setExpiryDate(addDaysToToday(days));
  }

  function handleCategoryChange(nextCategory: CategoryKey, isManual = true) {
    if (isManual) setHasManuallyChangedCategory(true);
    setCategory(nextCategory);
    const nextState = stateWasCustomized ? state : getSuggestedState(nextCategory);

    if (!expiryWasCustomized) {
      setExpiryDate(addDaysToToday(getSuggestedExpiryDays(nextCategory, nextState)));
    }
    if (!stateWasCustomized) {
      setState(nextState);
    }
  }

  function handleNameChange(value: string) {
    setName(value);
    if (value) setNameError(false);

    if (!hasManuallyChangedCategory) {
      const inferred = inferCategoryFromName(value);
      if (inferred && inferred !== category) {
        handleCategoryChange(inferred, false);
      }
    }
  }

  function handleExpiryDateChange(value: string) {
    setExpiryWasCustomized(true);
    setExpiryDate(value);
  }

  function handleStateChange(nextState: ProductState) {
    setStateWasCustomized(true);
    setState(nextState);

    if (!expiryWasCustomized) {
      setExpiryDate(addDaysToToday(getSuggestedExpiryDays(category, nextState)));
    }
  }

  function handleQuantityChange(id: string, delta: number) {
    const item = sessionProducts.find((p) => p.id === id);
    if (!item) return;
    const newQty = Math.max(1, item.quantity + delta);
    setSessionProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: newQty } : p)),
    );
    updateProduct(id, { quantity: newQty });
  }

  function handleScanDetected(barcode: string, info: BarcodeScanResult | null) {
    setShowScanner(false);
    if (info) {
      setName(info.name);
      setNameError(false);
      handleCategoryChange(info.category, false);
    }
  }

  function handleSaveAndAddAnother() {
    if (!name.trim()) {
      setNameError(true);
      return;
    }
    const newItem: SessionItem = {
      id: Date.now().toString(),
      name: name.trim(),
      category,
      state,
      daysUntilExpiry,
      quantity: 1,
    };
    addProduct(newItem);
    setSessionProducts((prev) => [...prev, newItem]);
    
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 2000);
    
    setName("");
    setHasManuallyChangedCategory(false);
    setExpiryWasCustomized(false);
    setStateWasCustomized(false);
    const resetState = getSuggestedState(category);
    setState(resetState);
    setExpiryDate(addDaysToToday(getSuggestedExpiryDays(category, resetState)));
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
    <>
    {showSuccessToast && (
      <div className="fixed left-4 right-4 top-4 z-50 flex justify-center transition-opacity duration-300">
        <div className="flex items-center gap-2 rounded-full bg-green px-5 py-3 text-[14px] font-bold text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <Icon name="check" size={18} color="#fff" strokeWidth={2.5} />
          ¡Producto guardado!
        </div>
      </div>
    )}
    {showScanner && (
      <BarcodeScanner
        onDetected={handleScanDetected}
        onClose={() => setShowScanner(false)}
      />
    )}
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
        <button
          type="button"
          onClick={() => setShowScanner(true)}
          aria-label="Escanear código de barras"
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-surface-alt"
        >
          <Icon name="barcode" size={20} color="currentColor" />
        </button>
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
              onChange={(e) => handleNameChange(e.target.value)}
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
                    onClick={() => handleCategoryChange(key)}
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
        <FormSection label="Estado" hint={stateHint}>
          <div className="flex rounded-xl border border-border bg-surface-alt p-1">
            {STATE_OPTIONS.map((opt) => {
              const isActive = state === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleStateChange(opt.id)}
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
        <FormSection label="Fecha de vencimiento" hint={dateHint}>
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
          <label className="relative flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3.5">
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
            {/* Native date input covering the whole row */}
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => handleExpiryDateChange(e.target.value)}
              className="absolute inset-0 cursor-pointer opacity-0"
              tabIndex={-1}
            />
          </label>
        </FormSection>
      </div>

      {/* Bottom panel: lista de sesión + botones */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-surface shadow-lg lg:absolute">
        {/* Lista colapsable de productos agregados en la sesión */}
        {sessionProducts.length > 0 && (
          <>
            {sessionExpanded && (
              <div className="max-h-44 divide-y divide-border overflow-y-auto">
                {sessionProducts.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 px-[18px] py-2.5">
                    <CategoryIcon category={item.category} size={32} />
                    <span className="flex-1 truncate text-[13.5px] font-semibold text-ink">
                      {item.name}
                    </span>
                    <DaysPill days={item.daysUntilExpiry} />
                    <div className="ml-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item.id, -1)}
                        aria-label="Restar cantidad"
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-surface-alt text-[16px] font-bold text-ink-soft transition-colors active:bg-border"
                      >
                        −
                      </button>
                      <span className="w-5 text-center text-[14px] font-bold text-ink">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item.id, +1)}
                        aria-label="Sumar cantidad"
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-surface-alt text-[16px] font-bold text-ink-soft transition-colors active:bg-border"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={() => setSessionExpanded((v) => !v)}
              className="flex w-full items-center justify-between border-b border-border px-[18px] py-2.5"
            >
              <span className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                <div
                  style={{
                    transform: sessionExpanded ? "rotate(0deg)" : "rotate(-90deg)",
                    transition: "transform 200ms",
                  }}
                >
                  <Icon name="chevronDown" size={14} color="#1B221F" />
                </div>
                {sessionProducts.length === 1
                  ? "1 producto agregado"
                  : `${sessionProducts.length} productos agregados`}
              </span>
              <span className="text-[11.5px] text-ink-mute">
                {sessionExpanded ? "Cerrar" : "Ver y editar"}
              </span>
            </button>
          </>
        )}

        {/* Botones de acción */}
        <div className="px-[18px] pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3">
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={handleSaveAndAddAnother}
              className="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-[16px] border-[2px] border-green bg-transparent text-[14px] font-bold text-green transition-opacity active:opacity-60"
            >
              <Icon name="plus" size={18} color="currentColor" strokeWidth={2.5} />
              Agregar otro
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-[16px] bg-green text-[14px] font-bold text-white shadow-md transition-opacity active:opacity-80"
            >
              <Icon name="check" size={18} color="#fff" strokeWidth={2.5} />
              Finalizar
            </button>
          </div>
        </div>
      </div>

      {showCamera && <CameraScanner onClose={() => setShowCamera(false)} />}
    </div>
    </>
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
