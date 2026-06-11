"use client";

import { Icon } from "@/components/icons/icon";
import { CategoryIcon } from "@/components/product/category-icon";
import { DaysPill } from "@/components/product/days-pill";
import type { CategoryKey, ProductState } from "@/lib/types";

type SummaryItem = {
  id: string;
  name: string;
  category: CategoryKey;
  state: ProductState;
  daysUntilExpiry: number;
  quantity: number;
};

type SessionSummaryProps = {
  items: SummaryItem[];
  onConfirm: () => void;
};

export function SessionSummary({ items, onConfirm }: SessionSummaryProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-bg">
      {/* Header */}
      <div className="px-[22px] pb-4 pt-[max(2rem,env(safe-area-inset-top))]">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green/10">
          <Icon name="check" size={22} color="#2F8F5C" strokeWidth={2.5} />
        </div>
        <p className="mt-3 text-[22px] font-bold leading-snug tracking-tight">
          {items.length === 1
            ? "1 producto agregado"
            : `${items.length} productos agregados`}
        </p>
        <p className="mt-1 text-[13.5px] text-ink-soft">
          Ya están en tu despensa, ordenados por urgencia.
        </p>
      </div>

      {/* Lista */}
      <div className="flex-1 divide-y divide-border overflow-y-auto border-t border-border">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 px-[18px] py-3">
            <CategoryIcon category={item.category} size={36} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-semibold text-ink">
                {item.name}
              </p>
              {item.quantity > 1 && (
                <p className="text-[12px] text-ink-soft">x{item.quantity}</p>
              )}
            </div>
            <DaysPill days={item.daysUntilExpiry} />
          </div>
        ))}
      </div>

      {/* Botón */}
      <div className="border-t border-border bg-surface px-[18px] pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3">
        <button
          type="button"
          onClick={onConfirm}
          className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[16px] bg-green text-[14px] font-bold text-white shadow-md transition-opacity active:opacity-80"
        >
          Ver mi despensa
          <Icon name="arrowRight" size={18} color="#fff" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
