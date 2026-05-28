"use client";

import { useEffect, useState } from "react";
import { getInventoryByUrgency } from "./inventory";
import type { Product } from "./types";

const STORAGE_KEY = "foodsense-inventory";

function load(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Product[];
  } catch {}
  return getInventoryByUrgency();
}

function save(products: Product[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch {}
}

export function useInventory() {
  // Lazy initializer: server gets mock, client gets localStorage (o mock si está vacío)
  const [products, setProducts] = useState<Product[]>(() =>
    typeof window === "undefined" ? getInventoryByUrgency() : load(),
  );

  useEffect(() => {
    save(products);
  }, [products]);

  function addProduct(product: Product) {
    setProducts((prev) =>
      [...prev, product].sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry),
    );
  }

  function consume(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  function remove(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  return { products, addProduct, consume, remove };
}
