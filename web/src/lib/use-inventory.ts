"use client";

import { useEffect, useState } from "react";
import { getInventoryByUrgency } from "./inventory";
import type { Product } from "./types";

const STORAGE_KEY = "foodsense-inventory";
const CONSUMED_KEY = "foodsense-consumed";
const WASTED_KEY = "foodsense-wasted";

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

function loadConsumedEntries(): { at: string }[] {
  try {
    const raw = localStorage.getItem(CONSUMED_KEY);
    if (raw) return JSON.parse(raw) as { at: string }[];
  } catch {}
  return [];
}

function loadWastedEntries(): { at: string }[] {
  try {
    const raw = localStorage.getItem(WASTED_KEY);
    if (raw) return JSON.parse(raw) as { at: string }[];
  } catch {}
  return [];
}

function countThisMonth(entries: { at: string }[]): number {
  const now = new Date();
  return entries.filter((e) => {
    const d = new Date(e.at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
}

export function useInventory() {
  const [products, setProducts] = useState<Product[]>(getInventoryByUrgency);
  const [isLoaded, setIsLoaded] = useState(false);
  const [consumedThisMonth, setConsumedThisMonth] = useState(0);
  const [wastedThisMonth, setWastedThisMonth] = useState(0);

  useEffect(() => {
    setProducts(load());
    setConsumedThisMonth(countThisMonth(loadConsumedEntries()));
    setWastedThisMonth(countThisMonth(loadWastedEntries()));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      save(products);
    }
  }, [products, isLoaded]);

  function addProduct(product: Product) {
    setProducts((prev) =>
      [...prev, product].sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry),
    );
  }

  function consume(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    const entries = loadConsumedEntries();
    entries.push({ at: new Date().toISOString() });
    try {
      localStorage.setItem(CONSUMED_KEY, JSON.stringify(entries));
    } catch {}
    setConsumedThisMonth(countThisMonth(entries));
  }

  function remove(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    const entries = loadWastedEntries();
    entries.push({ at: new Date().toISOString() });
    try {
      localStorage.setItem(WASTED_KEY, JSON.stringify(entries));
    } catch {}
    setWastedThisMonth(countThisMonth(entries));
  }

  function updateProduct(id: string, changes: Partial<Product>) {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...changes } : p)),
    );
  }

  return { products, addProduct, consume, remove, updateProduct, isLoaded, consumedThisMonth, wastedThisMonth };
}
