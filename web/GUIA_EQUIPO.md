# Guía para el equipo — FoodSense Web

Documento de continuidad para quienes sumen features sobre la base del **Sprint 1**.  
Autor de la base Despensa / US-07: **Mateo Cucurullo Larrosa**.

---

## 1. Introducción: qué es este proyecto y qué tecnología usamos

FoodSense es una aplicación **web** para ayudar a gestionar la despensa casera y priorizar alimentos según su vencimiento. El foco del curso está en **usabilidad** (mobile-first), no en revisión profunda de código.

### Stack elegido

| Tecnología | Versión (aprox.) | Rol |
|------------|------------------|-----|
| **Next.js** (App Router) | 16.x | Framework React con rutas, SSR/SSG y buen DX para entregar rápido |
| **React** | 19.x | UI por componentes |
| **TypeScript** | 5.x | Tipos para inventario, categorías y estados |
| **Tailwind CSS** | 4.x | Estilos alineados con los tokens del diseño |
| **pnpm** | 11.x | Gestor de dependencias (más rápido y estricto que npm) |

### Por qué se decidió así

1. **Web y no app nativa** — Menor costo y tiempo; un solo deploy; los profesores evalúan usabilidad en navegador y celular sin pasar por stores.
2. **Next.js** — Rutas por pantalla (`/despensa`, luego `/alertas`, etc.), buen soporte PWA en el futuro, y es el stack recomendado en `Documentacion/Foodsens/HANDOFF.md`.
3. **Mobile-first + responsive** — En pantallas chicas se ve como app (columna centrada, tabs abajo). Desde `lg` (1024px) se usa layout de **web** (sidebar, contenido ancho, tabla).
4. **Datos mock en código** — Por ahora no hay backend; el inventario vive en `src/lib/inventory.ts` para avanzar en paralelo. Cuando haya API, se reemplaza la capa de datos sin rehacer toda la UI.
5. **Diseño del equipo** — Colores, tipografía (Plus Jakarta Sans) e íconos siguen los wireframes en `Documentacion/Foodsens/` (ver `HANDOFF.md` y `screen-despensa.jsx`).

### Referencias externas

- Épica inventario: [EC-03 Panel de inventario (issue #18)](https://github.com/ORGANIZACIONUADE/FoodSense/issues/18)
- Diseño hi-fi / tokens: `../Documentacion/Foodsens/HANDOFF.md`

---

## 2. Cómo levantar el proyecto

```bash
cd web
pnpm install
pnpm dev
```

- App: [http://localhost:3000/despensa](http://localhost:3000/despensa) (la raíz `/` redirige a despensa).
- **pnpm 11:** si aparece `ERR_PNPM_IGNORED_BUILDS`, revisá que `pnpm-workspace.yaml` tenga `allowBuilds` con `sharp` y `unrs-resolver` en `true`, o ejecutá `pnpm approve-builds`.
- Si `pnpm dev` dice que ya hay otro servidor: `taskkill /PID <pid> /F` (el PID lo indica el mensaje de Next).

```bash
pnpm build   # verificar que compila
pnpm lint
```

---

## 3. Estructura de carpetas (lo que ya existe)

```
web/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Fuentes, metadata, viewport
│   │   ├── globals.css         # Tokens Tailwind + fondo desktop
│   │   ├── page.tsx            # redirect → /despensa
│   │   └── despensa/
│   │       └── page.tsx        # ★ Pantalla principal US-07
│   ├── components/
│   │   ├── despensa/           # ★ Piezas solo de la pantalla Despensa
│   │   ├── icons/              # SVG del diseño
│   │   ├── layout/             # Shell responsive + navegación
│   │   ├── product/            # Filas, pills, íconos de categoría
│   │   └── ui/                 # Card, etc.
│   └── lib/
│       ├── types.ts            # Product, CategoryKey, ProductState
│       ├── categories.ts       # Lácteos, carnes, …
│       ├── urgency.ts          # Colores y etiquetas por días
│       └── inventory.ts        # ★ Mock + orden por urgencia (US-07)
├── pnpm-workspace.yaml         # allowBuilds (pnpm 11)
└── GUIA_EQUIPO.md              # Este archivo
```

---

## 4. Qué implementó Mateo (US-07) — archivos clave

### User story

> **US-07:** Como usuario, quiero ver mi inventario ordenado por urgencia de vencimiento, para identificar rápidamente qué productos atender primero.

### Archivos creados o definidos para Despensa / US-07

| Archivo | Responsabilidad |
|---------|-----------------|
| `src/app/despensa/page.tsx` | Página Despensa: header, lista ordenada, layout mobile/desktop |
| `src/lib/inventory.ts` | Datos de ejemplo + `getInventoryByUrgency()` + `countUrgent()` |
| `src/lib/urgency.ts` | `urgencyTone()`, `formatDaysLabel()` (reglas ≤1 rojo, ≤4 ámbar, >4 verde) |
| `src/lib/types.ts` | Tipos `Product`, `CategoryKey`, `ProductState` |
| `src/lib/categories.ts` | Metadatos de categorías (label, icono, colores) |
| `src/components/despensa/inventory-summary.tsx` | Panel resumen (solo visible en desktop) |
| `src/components/despensa/inventory-legend.tsx` | Leyenda de colores de urgencia |
| `src/components/product/product-row.tsx` | Fila de producto (mobile + variante tabla en desktop) |
| `src/components/product/days-pill.tsx` | Badge “hoy”, “2 días”, etc. |
| `src/components/product/category-icon.tsx` | Ícono por categoría |
| `src/components/layout/app-shell.tsx` | Layout responsive (mobile vs sidebar) |
| `src/components/layout/side-nav.tsx` | Navegación lateral desktop |
| `src/components/layout/tab-bar.tsx` | Tabs inferiores (solo mobile) |
| `src/components/layout/mobile-shell.tsx` | Alias de `AppShell` (compatibilidad) |
| `src/components/icons/icon.tsx` + `icon-paths.tsx` | Set de íconos SVG |
| `src/components/ui/card.tsx` | Contenedor de lista |
| `src/app/globals.css` | Tokens de color y tipografía Tailwind |

### Comportamiento implementado

- Lista ordenada por `daysUntilExpiry` ascendente (lo más urgente arriba).
- Indicador **“Ordenar: Urgencia ↓”** (orden fijo por ahora; no hay selector de otro criterio).
- Números de posición (1, 2, 3…) para dejar claro el orden en demos.
- Placeholders deshabilitados: búsqueda, botón agregar, tabs de otras secciones (sin rutas aún).

### Qué **no** está hecho (otras US de la misma épica)

| Issue | User story (resumen) | Estado |
|-------|----------------------|--------|
| **US-08** | Filtrar inventario por categoría | Pendiente |
| **US-09** | Marcar producto como consumido | Pendiente |
| **US-10** | Eliminar producto del inventario | Pendiente |

---

## 5. Cómo continuar según cada issue (EC-03)

Todas comparten la misma épica [#18](https://github.com/ORGANIZACIONUADE/FoodSense/issues/18) y la ruta base **`/despensa`**. Conviene trabajar sobre los mismos tipos y el mock (o API) en `inventory.ts`.

### US-08 — Filtrar por categoría

**Objetivo:** Chips o filtros para ver solo Lácteos, Verduras, etc. (ver wireframe `screen-despensa.jsx`: fila de chips bajo el buscador).

**Por dónde empezar:**

1. En `src/app/despensa/page.tsx`, convertir la página en **Client Component** (`"use client"`) si usás estado local, o mantener Server Component y pasar filtros por URL (`?categoria=lacteos`).
2. Añadir estado `selectedCategory: CategoryKey | "todos"`.
3. Filtrar el array antes de renderizar:
   ```ts
   const filtered = selectedCategory === "todos"
     ? products
     : products.filter((p) => p.category === selectedCategory);
   ```
4. Reutilizar `CATEGORIES` de `src/lib/categories.ts` para labels y contadores (`Lácteos · 6`).
5. UI: fila horizontal de chips (en mobile ya hay espacio reservado en el header; en desktop puede ir junto al buscador).

**Archivos a tocar:** `despensa/page.tsx` (principal), opcional nuevo `components/despensa/category-filters.tsx`.

**Importante:** Mantener el **orden por urgencia** dentro del subconjunto filtrado (`getInventoryByUrgency` sobre el filtrado, no al revés).

---

### US-09 — Marcar como consumido

**Objetivo:** Acción por ítem para sacarlo del inventario activo o marcarlo consumido (definir con el equipo si desaparece o pasa a historial).

**Por dónde empezar:**

1. Extender `Product` en `types.ts` si hace falta: `consumedAt?: string` o flag `consumed: boolean`.
2. Mover el mock a estado mutable:
   - Corto plazo: `useState` + `localStorage` en un hook `useInventory()`.
   - Mediano plazo: contexto (`InventoryProvider`) o Zustand.
3. En `product-row.tsx`, añadir botón/icono “consumido” (ícono `check` en `icon-paths.tsx`).
4. Handler: `markConsumed(id)` que actualiza la lista y persiste.

**Archivos a tocar:** `lib/inventory.ts` (o nuevo `lib/inventory-store.ts`), `product-row.tsx`, `despensa/page.tsx`.

**UX:** Confirmación suave o undo opcional; microcopy empático según `HANDOFF.md` (evitar culpa).

---

### US-10 — Eliminar del inventario

**Objetivo:** Quitar un ítem que ya no corresponde (error de carga, etc.).

**Por dónde empezar:**

1. Misma capa de estado que US-09 (`removeProduct(id)`).
2. Botón con ícono `trash`; diálogo de confirmación accesible.
3. Actualizar contadores del resumen (`InventorySummary`) si el filtro US-08 está hecho.

**Archivos a tocar:** mismos que US-09 + posible `components/despensa/delete-product-dialog.tsx`.

**Coordinación:** US-09 y US-10 comparten estado de inventario; conviene que **una persona** haga el hook/store y el otro las acciones, o hacerlo en un mismo PR.

---

## 6. Pantallas futuras (fuera de EC-03, otros sprints)

No están implementadas; la navegación es visual solamente. Referencia en `Documentacion/Foodsens/`:

| Pantalla | Archivo diseño | Ruta sugerida |
|----------|----------------|---------------|
| Dashboard | `screen-dashboard.jsx` | `/` o `/inicio` |
| Detalle producto | `screen-detalle.jsx` | `/despensa/[id]` |
| Alertas | `screen-alertas.jsx` | `/alertas` |
| Escaneo | `screen-escaneo.jsx` | `/escanear` |
| Agregar manual | `screen-agregar.jsx` | `/agregar` |
| Onboarding | `screen-onboarding.jsx` | `/bienvenida`, etc. |

Al crear cada ruta:

1. Usar `<AppShell active="...">` con el `active` correcto en `side-nav` / `tab-bar`.
2. Reutilizar `ProductRow`, `DaysPill`, `urgency.ts`, `categories.ts`.
3. Registrar el link en `side-nav.tsx` y `tab-bar.tsx` (hoy son `<span>`, pasar a `<Link href="...">` de `next/link`).

---

## 7. Convenciones del código base

- **Idioma UI:** español neutro (LatAm).
- **Colores de urgencia:** solo vía `urgencyTone()` / `DaysPill`, no hardcodear rojo/ámbar en cada pantalla.
- **Categorías:** solo claves de `CategoryKey` y metadata en `categories.ts`.
- **Responsive:** estilos mobile por defecto; prefijo `lg:` para desktop (sidebar, grid, tabla).
- **Sin emojis en UI** (salvo microcopy puntual del diseño).
- **Commits:** mensajes claros por US (`feat(despensa): filtros por categoría US-08`).

---

## 8. Checklist antes de abrir un PR

- [ ] `pnpm build` sin errores
- [ ] `pnpm lint` sin errores nuevos
- [ ] Probado en viewport mobile (~390px) y desktop (>1024px)
- [ ] No se rompe el orden por urgencia (US-07) salvo que el issue diga lo contrario
- [ ] Actualizar este archivo o `README.md` si agregás rutas, scripts o dependencias

---

## 9. Contacto y dudas de diseño

- Dudas visuales: abrir `Documentacion/Foodsens/FoodSense Hi-Fi.html` o leer `HANDOFF.md`.
- Dudas de la base Despensa / US-07: revisar este doc y los archivos listados en la sección 4.

¡Buen sprint!
