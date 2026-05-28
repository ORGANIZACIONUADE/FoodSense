import type { CategoryKey } from "./types";

export type CategoryMeta = {
  label: string;
  icon: string;
  tint: string;
  stroke: string;
};

export const CATEGORIES: Record<CategoryKey, CategoryMeta> = {
  lacteos: { label: "Lácteos", icon: "dairy", tint: "#EAF2FB", stroke: "#3E7CB1" },
  carnes: { label: "Carnes", icon: "meat", tint: "#FAE5DC", stroke: "#B5573B" },
  verduras: { label: "Verduras", icon: "veg", tint: "#E5F1E8", stroke: "#2F8F5C" },
  frutas: { label: "Frutas", icon: "fruit", tint: "#FBE9D2", stroke: "#B8772D" },
  panificados: { label: "Panificados", icon: "bread", tint: "#F5EBD8", stroke: "#8A6A2E" },
  bebidas: { label: "Bebidas", icon: "drinks", tint: "#E6EEF1", stroke: "#3A6F7E" },
  huevos: { label: "Huevos", icon: "egg", tint: "#FAF5E6", stroke: "#9C7A2E" },
  conservas: { label: "Conservas", icon: "pantry", tint: "#F0EBE3", stroke: "#5C6460" },
};
