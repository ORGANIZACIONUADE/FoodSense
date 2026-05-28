# FoodSense

App web mobile-first para gestionar la despensa y reducir desperdicio de alimentos.

## Estructura

| Carpeta | Contenido |
|---------|-----------|
| `Documentacion/Foodsens/` | Wireframes, tokens y handoff de diseño |
| `web/` | Aplicación Next.js (Sprint 1) |

## Arranque rápido

```bash
cd web
pnpm install
pnpm dev
```

## Documentación para desarrolladores

- [web/README.md](web/README.md) — Comandos, enlaces rápidos y **lectura obligatoria Issue 5 vs 6** (conflictos).
- [web/GUIA_EQUIPO.md](web/GUIA_EQUIPO.md) — Tecnología, archivos de Despensa (US-07), guía por issue (US-08–US-10) y coordinación Issue 5/6.

## Deploy (GitHub Pages)

La app está en `web/`, no en la raíz del repo. Si el deploy apunta a la raíz, solo se ve este README.

1. En el repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**
2. Push a `main` (corre `.github/workflows/deploy-pages.yml`)
3. URL: [https://organizacionuade.github.io/FoodSense/](https://organizacionuade.github.io/FoodSense/) (redirige a `/despensa`)

**Alternativa más simple:** [Vercel](https://vercel.com) → Import repo → **Root Directory: `web`** → Deploy.
