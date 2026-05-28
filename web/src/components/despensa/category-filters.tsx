"use client";

import { CATEGORIES } from "@/lib/categories";
import type { CategoryKey, Product } from "@/lib/types";

type CategoryFiltersProps = {
  all: Product[];
  selected: CategoryKey | "todos";
  onChange: (value: CategoryKey | "todos") => void;
};

export function CategoryFilters({ all, selected, onChange }: CategoryFiltersProps) {
  const usedCategories = (Object.keys(CATEGORIES) as CategoryKey[]).filter(
    (key) => all.some((p) => p.category === key),
  );

  const chips: Array<{ key: CategoryKey | "todos"; label: string; count: number }> = [
    { key: "todos", label: "Todos", count: all.length },
    ...usedCategories.map((key) => ({
      key,
      label: CATEGORIES[key].label,
      count: all.filter((p) => p.category === key).length,
    })),
  ];

  return (
    <div
      className="-mx-[18px] flex gap-2 overflow-x-auto px-[18px] pb-2 pt-3 scrollbar-none lg:mx-0 lg:px-0 lg:pt-4"
      role="group"
      aria-label="Filtrar por categoría"
    >
      {chips.map((chip) => {
        const isActive = selected === chip.key;
        return (
          <button
            key={chip.key}
            type="button"
            onClick={() => onChange(chip.key)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-colors ${
              isActive
                ? "border-green bg-green text-white"
                : "border-border bg-surface text-ink-soft hover:border-green/50 hover:text-ink"
            }`}
            aria-pressed={isActive}
          >
            {chip.label}
            <span
              className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] font-semibold ${
                isActive ? "bg-white/20 text-white" : "bg-surface-alt text-ink-mute"
              }`}
            >
              {chip.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
