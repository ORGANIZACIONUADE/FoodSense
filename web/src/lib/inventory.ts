import type { Product } from "./types";

/** Datos de demo para el sprint 1 (US-07). */
const MOCK_INVENTORY: Product[] = [
  {
    id: "1",
    name: "Pollo trozado",
    category: "carnes",
    state: "congelado",
    daysUntilExpiry: 30,
  },
  {
    id: "2",
    name: "Leche entera Serenísima",
    category: "lacteos",
    state: "cerrado",
    daysUntilExpiry: 8,
  },
  {
    id: "3",
    name: "Tomate perita",
    category: "verduras",
    state: "cerrado",
    daysUntilExpiry: 6,
  },
  {
    id: "4",
    name: "Queso cremoso Paulina",
    category: "lacteos",
    state: "abierto",
    daysUntilExpiry: 4,
  },
  {
    id: "5",
    name: "Bondiola fresca",
    category: "carnes",
    state: "cerrado",
    daysUntilExpiry: 3,
  },
  {
    id: "6",
    name: "Lechuga mantecosa",
    category: "verduras",
    state: "cerrado",
    daysUntilExpiry: 2,
  },
  {
    id: "7",
    name: "Yogur natural Ilolay",
    category: "lacteos",
    state: "abierto",
    daysUntilExpiry: 0,
  },
];

/** US-07: inventario ordenado por urgencia (menor días = primero). */
export function getInventoryByUrgency(): Product[] {
  return [...MOCK_INVENTORY].sort(
    (a, b) => a.daysUntilExpiry - b.daysUntilExpiry,
  );
}

export function countUrgent(products: Product[]): number {
  return products.filter((p) => p.daysUntilExpiry <= 4).length;
}

/** Issue 6 — busca en el mock base. Para inventario en vivo usar useInventory(). */
export function getProductById(id: string): Product | undefined {
  return MOCK_INVENTORY.find((p) => p.id === id);
}
