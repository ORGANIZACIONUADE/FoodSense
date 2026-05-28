export type ProductState = "cerrado" | "abierto" | "congelado";

export type CategoryKey =
  | "lacteos"
  | "carnes"
  | "verduras"
  | "frutas"
  | "panificados"
  | "bebidas"
  | "huevos"
  | "conservas";

export interface Product {
  id: string;
  name: string;
  category: CategoryKey;
  state: ProductState;
  /** Días hasta el vencimiento (0 = hoy). */
  daysUntilExpiry: number;
}
