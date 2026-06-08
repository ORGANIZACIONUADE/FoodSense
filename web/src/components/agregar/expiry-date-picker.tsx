"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/components/icons/icon";
import { DaysPill } from "@/components/product/days-pill";

function addDays(days: number): string {
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

const PRESETS = [
  { label: "Hoy", days: 0 },
  { label: "Mañana", days: 1 },
  { label: "3 días", days: 3 },
  { label: "1 semana", days: 7 },
  { label: "10 días", days: 10 },
  { label: "2 semanas", days: 14 },
  { label: "3 semanas", days: 21 },
  { label: "1 mes", days: 30 },
  { label: "2 meses", days: 60 },
  { label: "3 meses", days: 90 },
  { label: "6 meses", days: 180 },
  { label: "1 año", days: 365 },
];

type ExpiryDatePickerProps = {
  open: boolean;
  value: string;
  onChange: (date: string) => void;
  onClose: () => void;
};

export function ExpiryDatePicker({
  open,
  value,
  onChange,
  onClose,
}: ExpiryDatePickerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) dialog.showModal();
    else dialog.close();
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  function handlePreset(days: number) {
    onChange(addDays(days));
    dialogRef.current?.close();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-modal="true"
      aria-label="Elegir fecha de vencimiento"
      className="fixed bottom-0 left-0 right-0 top-auto m-0 w-full max-w-full rounded-t-2xl border-t border-border bg-bg p-0 shadow-xl backdrop:bg-black/40"
    >
      {/* Handle */}
      <div className="flex justify-center pb-1 pt-3">
        <div className="h-1 w-10 rounded-full bg-border" />
      </div>

      {/* Título */}
      <div className="flex items-center justify-between px-[18px] pb-3 pt-1">
        <p className="text-[15px] font-bold tracking-tight">¿Cuándo vence?</p>
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-surface-alt"
        >
          <Icon name="x" size={16} color="currentColor" />
        </button>
      </div>

      {/* Grid de presets */}
      <div className="grid grid-cols-3 gap-2 px-[18px] pb-4">
        {PRESETS.map((p) => {
          const targetDate = addDays(p.days);
          const isActive = value === targetDate;
          return (
            <button
              key={p.days}
              type="button"
              onClick={() => handlePreset(p.days)}
              className={`flex flex-col items-center gap-1 rounded-xl border py-3 transition-colors ${
                isActive
                  ? "border-green bg-green/10"
                  : "border-border bg-surface hover:border-green/40"
              }`}
            >
              <span
                className={`text-[13.5px] ${
                  isActive ? "font-bold text-green" : "font-semibold text-ink"
                }`}
              >
                {p.label}
              </span>
              {isActive && <DaysPill days={p.days} />}
            </button>
          );
        })}
      </div>

      {/* Fecha exacta */}
      <div className="border-t border-border px-[18px] pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4">
        <p className="mb-2 font-mono text-[10.5px] font-semibold uppercase tracking-[1.3px] text-ink-soft">
          Fecha exacta
        </p>
        <label className="relative flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3.5">
          <Icon name="calendar" size={20} color="#5C6460" />
          <div className="flex-1">
            <p className="mt-0.5 text-[15px] font-bold capitalize">
              {formatDateLabel(value)}
            </p>
          </div>
          <DaysPill days={dateToDays(value)} />
          <input
            type="date"
            value={value}
            onChange={(e) => {
              if (e.target.value) onChange(e.target.value);
            }}
            className="absolute inset-0 cursor-pointer opacity-0"
            tabIndex={-1}
          />
        </label>
      </div>
    </dialog>
  );
}
