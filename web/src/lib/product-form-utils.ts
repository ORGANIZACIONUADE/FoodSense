import type { CategoryKey, ProductState } from "./types";

export const STATE_OPTIONS: { id: ProductState; label: string; icon: string }[] = [
  { id: "cerrado", label: "Cerrado", icon: "closed" },
  { id: "abierto", label: "Abierto", icon: "open" },
  { id: "congelado", label: "Congelado", icon: "snow" },
];

export const STATE_LABELS: Record<ProductState, string> = {
  cerrado: "Cerrado",
  abierto: "Abierto",
  congelado: "Congelado",
};

export const QUICK_PRESETS = [
  { label: "Hoy", days: 0 },
  { label: "3 días", days: 3 },
  { label: "1 semana", days: 7 },
  { label: "2 semanas", days: 14 },
  { label: "1 mes", days: 30 },
];

export const DEFAULT_EXPIRY_BY_CATEGORY_AND_STATE: Record<
  CategoryKey,
  Record<ProductState, number>
> = {
  lacteos: { cerrado: 7, abierto: 7, congelado: 30 },
  carnes: { cerrado: 3, abierto: 3, congelado: 30 },
  verduras: { cerrado: 7, abierto: 3, congelado: 30 },
  frutas: { cerrado: 7, abierto: 3, congelado: 30 },
  panificados: { cerrado: 7, abierto: 3, congelado: 30 },
  bebidas: { cerrado: 30, abierto: 7, congelado: 30 },
  huevos: { cerrado: 14, abierto: 7, congelado: 30 },
  conservas: { cerrado: 30, abierto: 14, congelado: 30 },
};

export const DEFAULT_STATE_BY_CATEGORY: Record<CategoryKey, ProductState> = {
  lacteos: "abierto",
  carnes: "congelado",
  verduras: "cerrado",
  frutas: "cerrado",
  panificados: "cerrado",
  bebidas: "cerrado",
  huevos: "cerrado",
  conservas: "cerrado",
};

export function addDaysToToday(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function dateToDays(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(dateStr + "T00:00:00");
  return Math.round((expiry.getTime() - today.getTime()) / 86_400_000);
}

export function formatDateLabel(dateStr: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function getSuggestedExpiryDays(
  category: CategoryKey,
  currentState: ProductState,
): number {
  return DEFAULT_EXPIRY_BY_CATEGORY_AND_STATE[category][currentState];
}

export function getSuggestedState(category: CategoryKey): ProductState {
  return DEFAULT_STATE_BY_CATEGORY[category];
}

export function formatExpiryHint(days: number): string {
  if (days === 0) return "Sugerencia: hoy";
  if (days === 3) return "Sugerencia: 3 días";
  if (days === 7) return "Sugerencia: 1 semana";
  if (days === 14) return "Sugerencia: 2 semanas";
  if (days === 30) return "Sugerencia: 1 mes";
  return `Sugerencia: ${days} días`;
}

export function formatStateHint(state: ProductState): string {
  return `Sugerencia: ${STATE_LABELS[state]}`;
}

export const CATEGORY_KEYWORDS: Record<CategoryKey, string[]> = {
  lacteos: ["leche", "queso", "yogur", "manteca", "crema", "lacteo", "dulce de leche", "postrecito", "ricota", "mozzarella", "provoleta", "sancor", "la serenisima"],
  carnes: ["carne", "pollo", "cerdo", "pescado", "hamburguesa", "salchicha", "matambre", "asado", "vacio", "chorizo", "morcilla", "milanesa", "bondiola", "pechuga", "bife", "entraña", "costilla", "chinchulin", "molida", "picada", "merluza", "salmon", "atun fresco"],
  verduras: ["lechuga", "tomate", "cebolla", "papa", "zanahoria", "verdura", "zapallo", "morron", "ajo", "acelga", "espinaca", "rucula", "batata", "palta", "pepino", "zucchini", "berenjena", "apio", "puerro", "perejil", "cilantro", "albahaca", "remolacha"],
  frutas: ["manzana", "banana", "naranja", "pera", "uva", "fruta", "mandarina", "limon", "pomelo", "durazno", "ciruela", "frutilla", "arandano", "kiwi", "sandia", "melon", "cereza", "anana"],
  panificados: ["pan", "galletita", "factura", "torta", "budin", "harina", "alfajor", "medialuna", "bizcocho", "pepa", "pionono", "tarta", "empanada", "prepisa", "tostada", "churro", "pancho", "pebete", "miga"],
  bebidas: ["agua", "jugo", "gaseosa", "coca", "sprite", "cerveza", "vino", "bebida", "fernet", "soda", "limonada", "te", "cafe", "mate", "yerba", "licor", "champagne", "sidra", "tonica", "paso de los toros", "pritty", "manaos", "cepita", "baggio"],
  huevos: ["huevo", "maple", "codorniz"],
  conservas: ["lata", "arroz", "fideo", "salsa", "arveja", "choclo", "lenteja", "conserva", "atun", "jurel", "caballa", "mayonesa", "ketchup", "mostaza", "mermelada", "polenta", "garbanzo", "poroto", "aceite", "vinagre", "sal", "azucar", "edulcorante", "caldo", "sopa", "pure de tomate", "sardina", "picadillo", "pate", "aderezo", "chimichurri", "provenzal"]
};

export function inferCategoryFromName(name: string): CategoryKey | null {
  const s = name.toLowerCase();
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS) as [CategoryKey, string[]][]) {
    for (const kw of keywords) {
      // Búsqueda de palabra exacta con soporte para plurales (s o es)
      const regex = new RegExp(`\\b${kw}(s|es)?\\b`, 'i');
      if (regex.test(s)) {
        return category;
      }
    }
  }
  return null;
}
