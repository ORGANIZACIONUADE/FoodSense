"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { CategoryFilters } from "@/components/despensa/category-filters";
import { InventoryLegend } from "@/components/despensa/inventory-legend";
import { InventorySummary } from "@/components/despensa/inventory-summary";
import { Icon } from "@/components/icons/icon";
import { ProductRow } from "@/components/product/product-row";
import { Card } from "@/components/ui/card";
import { countUrgent } from "@/lib/inventory";
import { useInventory } from "@/lib/use-inventory";
import { DeleteProductDialog } from "@/components/despensa/delete-product-dialog";
import { useRequireAuth } from "@/lib/use-require-auth";
import type { CategoryKey, Product } from "@/lib/types";

export default function DespensaPage() {
  const session = useRequireAuth();
  const { products, consume, remove } = useInventory();
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | "todos">("todos");
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  if (!session) return null;

  const displayed =
    selectedCategory === "todos"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const urgentCount = countUrgent(displayed);

  return (
    <AppShell active="pantry">
      <header className="sticky top-0 z-10 bg-bg px-[18px] pb-2 pt-[max(0.75rem,env(safe-area-inset-top))] lg:static lg:px-0 lg:pb-0 lg:pt-0">
        <div className="mb-3.5 flex items-center justify-between lg:mb-6">
          <div>
            <h1 className="text-[26px] font-bold leading-none tracking-tight lg:text-[32px]">
              Despensa
            </h1>
            <p className="mt-1 text-[12.5px] text-ink-soft lg:text-sm">
              {displayed.length} productos · prioridad por vencimiento
            </p>
          </div>
          <Link
            href="/agregar"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green text-white shadow-md lg:h-12 lg:w-auto lg:gap-2 lg:rounded-full lg:px-5"
            aria-label="Agregar producto"
          >
            <Icon name="plus" size={22} color="#fff" strokeWidth={2.25} />
            <span className="hidden font-semibold lg:inline">Agregar</span>
          </Link>
        </div>

        <div
          className="flex h-11 items-center gap-2.5 rounded-md border border-border bg-surface px-3.5 text-ink-mute lg:h-12 lg:max-w-xl"
          role="search"
          aria-label="Buscar en la despensa (próximamente)"
        >
          <Icon name="search" size={18} color="#9AA09C" />
          <span className="text-sm">Buscar en la despensa…</span>
        </div>

        <CategoryFilters
          all={products}
          selected={selectedCategory}
          onChange={setSelectedCategory}
        />
      </header>

      <section
        className="flex items-center justify-between px-[18px] py-2 lg:hidden"
        aria-label="Orden del inventario"
      >
        <p className="font-mono text-[10px] uppercase tracking-wider text-ink-mute">
          {urgentCount > 0
            ? `${urgentCount} productos requieren atención`
            : "Todo al día"}
        </p>
        <p className="flex items-center gap-1 text-[11px] text-ink-soft">
          <span>Ordenar:</span>
          <span className="font-semibold text-ink">Urgencia ↓</span>
        </p>
      </section>

      <div className="flex flex-1 flex-col lg:mt-6 lg:grid lg:grid-cols-[minmax(240px,280px)_1fr] lg:items-start lg:gap-8">
        <aside className="hidden lg:block">
          <InventorySummary total={displayed.length} urgentCount={urgentCount} />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="mb-4 hidden items-center justify-between lg:flex">
            <p className="text-sm text-ink-soft">
              Lo que vence antes aparece primero. Los colores te ayudan a ver
              qué atender ya.
            </p>
            <p className="flex items-center gap-1 text-sm text-ink-soft">
              <span>Ordenar:</span>
              <span className="font-semibold text-ink">Urgencia ↓</span>
            </p>
          </div>

          <main className="flex-1 overflow-y-auto px-[18px] pb-4 lg:px-0 lg:pb-0">
            <p className="mb-3 text-sm text-ink-soft lg:hidden">
              Lo que vence antes aparece primero. Los colores te ayudan a ver
              qué atender ya.
            </p>

            <Card className="overflow-hidden px-4 lg:px-0">
              <div
                className="hidden border-b border-border-soft px-6 py-3 lg:grid lg:grid-cols-[2rem_3rem_1fr_auto_auto] lg:items-center lg:gap-4"
                aria-hidden
              >
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink-mute">
                  #
                </span>
                <span />
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink-mute">
                  Producto
                </span>
                <span className="text-right font-mono text-[10px] uppercase tracking-wider text-ink-mute">
                  Vence
                </span>
                <span className="text-right font-mono text-[10px] uppercase tracking-wider text-ink-mute">
                  Acciones
                </span>
              </div>

              <ol
                className="list-none lg:divide-y lg:divide-border-soft"
                aria-label="Inventario por urgencia"
              >
                {displayed.map((product, index) => (
                  <li key={product.id} className="lg:px-6 lg:py-0.5">
                    <ProductRow
                      product={product}
                      rank={index + 1}
                      divider={index < displayed.length - 1}
                      variant="responsive"
                      onConsume={() => consume(product.id)}
                      onDelete={() => setProductToDelete(product)}
                    />
                  </li>
                ))}
              </ol>
            </Card>

            <InventoryLegend className="mt-4 lg:hidden" />
          </main>
        </div>
      </div>
      <DeleteProductDialog
        product={productToDelete}
        onConfirm={() => {
          if (productToDelete) remove(productToDelete.id);
          setProductToDelete(null);
        }}
        onCancel={() => setProductToDelete(null)}
      />
    </AppShell>
  );
}
