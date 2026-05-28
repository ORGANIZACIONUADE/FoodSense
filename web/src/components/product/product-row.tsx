"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons/icon";
import { CATEGORIES } from "@/lib/categories";
import type { Product } from "@/lib/types";
import { CategoryIcon } from "./category-icon";
import { DaysPill } from "./days-pill";

const STATE_META = {
  cerrado: { icon: "closed", label: "Cerrado" },
  abierto: { icon: "open", label: "Abierto" },
  congelado: { icon: "snow", label: "Congelado" },
} as const;

type ProductRowProps = {
  product: Product;
  divider?: boolean;
  rank?: number;
  variant?: "default" | "responsive";
  onConsume?: () => void;
  onDelete?: () => void;
};

export function ProductRow({
  product,
  divider = true,
  rank,
  variant = "default",
  onConsume,
  onDelete,
}: ProductRowProps) {
  const cat = CATEGORIES[product.category];
  const st = STATE_META[product.state];
  const isResponsive = variant === "responsive";

  const [undoing, setUndoing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function handleConsume() {
    setUndoing(true);
    timerRef.current = setTimeout(() => {
      setUndoing(false);
      onConsume?.();
    }, 3000);
  }

  function handleUndoConsume() {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    setUndoing(false);
  }

  const dividerClass =
    divider && !isResponsive
      ? "border-b border-border-soft"
      : divider && isResponsive
        ? "border-b border-border-soft lg:border-0"
        : "";

  return (
    <article
      className={`flex items-center gap-3 py-3 ${dividerClass} ${
        isResponsive
          ? "lg:grid lg:grid-cols-[2rem_3rem_1fr_auto] lg:items-center lg:gap-4 lg:py-4"
          : ""
      }`}
    >
      {rank != null && (
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-alt font-mono text-[10px] font-semibold text-ink-mute lg:h-8 lg:w-8 lg:bg-transparent lg:text-xs"
          aria-hidden
        >
          {rank}
        </span>
      )}
      <CategoryIcon category={product.category} size={isResponsive ? 44 : 44} />
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-[14.5px] font-semibold tracking-tight lg:text-base">
          {product.name}
        </h3>
        <p className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-ink-soft lg:text-sm">
          <span>{cat.label}</span>
          <span className="text-ink-faint">·</span>
          <Icon name={st.icon} size={12} color="#5C6460" />
          <span>{st.label}</span>
        </p>
      </div>
      <div className={`flex items-center gap-2 ${isResponsive ? "lg:justify-self-end" : ""}`}>
        {undoing ? (
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-green/10 px-2.5 py-1.5 text-[11px] font-semibold text-green">
              Consumido
            </span>
            <button
              type="button"
              onClick={handleUndoConsume}
              className="text-[12px] font-medium text-ink-soft transition-colors hover:text-ink"
            >
              Deshacer
            </button>
          </div>
        ) : (
          <>
            <DaysPill days={product.daysUntilExpiry} />
            {(onConsume || onDelete) && (
              <div className="flex items-center gap-1">
                {onConsume && (
                  <button
                    type="button"
                    onClick={handleConsume}
                    aria-label={`Marcar ${product.name} como consumido`}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-green transition-colors hover:bg-green/10 active:bg-green/20"
                  >
                    <Icon name="check" size={16} color="currentColor" strokeWidth={2.5} />
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    onClick={onDelete}
                    aria-label={`Eliminar ${product.name} del inventario`}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-ink-mute transition-colors hover:bg-red-50 hover:text-red-500 active:bg-red-100"
                  >
                    <Icon name="trash" size={16} color="currentColor" strokeWidth={2} />
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </article>
  );
}
