# FoodSense — Web (Sprint 1)

Aplicación web mobile-first. Referencia visual: `../Documentacion/Foodsens/`.

## Documentación para el equipo

**Leé primero:** [GUIA_EQUIPO.md](./GUIA_EQUIPO.md)

Ahí está la introducción al stack, los archivos de la Despensa (US-07, Mateo Cucurullo Larrosa), y cómo continuar con US-08, US-09 y US-10 de la [épica EC-03](https://github.com/ORGANIZACIONUADE/FoodSense/issues/18).

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
