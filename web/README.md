# FoodSense — Web (Sprint 1)

Aplicación web mobile-first. Referencia visual: `../Documentacion/Foodsens/`.

## ⚠️ Lectura obligatoria (agentes y devs — Issue 5 y 6)

**Antes de implementar el Issue 5 (Despensa v2) o el Issue 6 (Detalle de producto), leé completa la sección [Coordinación Issue 5 vs Issue 6](./GUIA_EQUIPO.md#coordinación-issue-5-vs-issue-6-conflictos) en `GUIA_EQUIPO.md`.**

Ambos issues tocan los mismos archivos (`despensa/page.tsx`, `product-row.tsx`, `lib/inventory.ts`). Si no seguís esas reglas, van a aparecer conflictos de merge y se puede romper US-07 (orden por urgencia) o la navegación al detalle.

**Resumen rápido:**

| Issue | Alcance principal | Archivos “dueño” del issue |
|-------|-------------------|----------------------------|
| **5** | Mejoras de layout/filtros/UX en `/despensa` | `app/despensa/page.tsx`, `components/despensa/*` |
| **6** | Ruta `/despensa/[id]` + link desde cada fila | `app/despensa/[id]/page.tsx`, props de navegación en `ProductRow` |

- **Orden de merge recomendado:** primero Issue **5**, después Issue **6** (o una sola rama si trabajan juntos).
- **No duplicar** datos mock: una sola fuente en `lib/inventory.ts` (+ helper `getProductById` para el 6).
- **No refactorizar** `ProductRow` / `page.tsx` entero en el Issue 6: solo agregar navegación al detalle sin cambiar el layout que defina el Issue 5.

Si sos un agente de IA: incluí en tu plan de trabajo que leíste esta sección y respetás la división de archivos antes de editar.

---

## Documentación para el equipo

**Leé primero:** [GUIA_EQUIPO.md](./GUIA_EQUIPO.md)

Ahí está la introducción al stack, los archivos de la Despensa (US-07, Mateo Cucurullo Larrosa), cómo continuar con US-08, US-09 y US-10 de la [épica EC-03](https://github.com/ORGANIZACIONUADE/FoodSense/issues/18), y la coordinación Issue 5 / 6.

## Arranque rápido

```bash
cd web
pnpm install
pnpm dev
```

- [http://localhost:3000/despensa](http://localhost:3000/despensa)

## Scripts

| Comando | Uso |
|---------|-----|
| `pnpm dev` | Desarrollo |
| `pnpm build` | Build de producción |
| `pnpm start` | Servir build |
| `pnpm lint` | ESLint |

## US-07 (implementado)

Inventario ordenado por urgencia de vencimiento en `/despensa`.
