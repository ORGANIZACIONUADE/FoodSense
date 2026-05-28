# FoodSense · Handoff para Claude Code

Esta carpeta contiene **8 pantallas hi-fi** de FoodSense + el sistema de diseño completo. Está pensada para ser leída por Claude Code como referencia visual y de tokens para implementar la PWA en **Next.js + Tailwind CSS**.

---

## Cómo usar este paquete

1. Descargá toda la carpeta (botón de descarga en el chat).
2. Abrí Claude Code y montá el proyecto Next.js + Tailwind (`npx create-next-app@latest foodsense --typescript --tailwind --app`).
3. Pegale a Claude Code este mensaje inicial:

> Tomá como referencia visual y de tokens los archivos en `./design-reference/` (especialmente `tokens.jsx`, `components.jsx`, `icons.jsx` y los `screen-*.jsx`). Vamos a implementar la PWA FoodSense siguiendo ese sistema. Empezá generando `tailwind.config.ts` con los tokens, después armamos los componentes base.

4. A continuación tenés todo lo que necesita Claude Code para arrancar bien.

---

## Stack objetivo

- **Framework**: Next.js 14+ (App Router)
- **Estilos**: Tailwind CSS 3.4+
- **PWA**: `next-pwa` o app manifest manual
- **Mobile-first**: viewport base 390 × 844
- **i18n**: español neutro (LatAm)

---

## Estructura recomendada del proyecto

```
src/
├── app/
│   ├── (onboarding)/
│   │   └── bienvenida/page.tsx          → Onboarding1
│   │       /como-funciona/page.tsx      → Onboarding2
│   │       /avisos/page.tsx             → Onboarding3
│   ├── (main)/
│   │   ├── layout.tsx                   → con <TabBar/>
│   │   ├── page.tsx                     → Dashboard
│   │   ├── despensa/page.tsx            → Despensa
│   │   ├── despensa/[id]/page.tsx       → Detalle
│   │   ├── alertas/page.tsx             → Alertas
│   │   ├── reporte/page.tsx             → Reporte mensual
│   │   ├── escanear/page.tsx            → Escaneo
│   │   └── agregar/page.tsx             → Agregar manual
│   └── layout.tsx
├── components/
│   ├── ui/                              → Button, Chip, Card, etc.
│   ├── icons/                           → set de íconos
│   └── product/                         → ProductRow, CategoryIcon, DaysPill
├── lib/
│   ├── tokens.ts                        → tokens TS
│   ├── urgency.ts                       → urgencyTone()
│   └── categories.ts                    → CATEGORIES
└── styles/
    └── globals.css
```

---

## Design tokens

### Color

| Token              | Hex      | Uso                                |
|--------------------|----------|------------------------------------|
| `green`            | `#2F8F5C`| Acción positiva, primary           |
| `green-deep`       | `#1F6B43`| Texto sobre fondos verde-soft      |
| `green-soft`       | `#E5F1E8`| Fondos de chips verde              |
| `green-wash`       | `#F2F8F3`| Fondos sutiles (cards, secciones)  |
| `amber`            | `#E89F4D`| Atención cercana, calidez          |
| `amber-deep`       | `#B8772D`| Texto sobre amber-soft             |
| `amber-soft`       | `#FBE9D2`| Fondos chips ámbar                 |
| `amber-wash`       | `#FDF5EB`| Fondos sutiles ámbar               |
| `red`              | `#D85B4A`| Urgencia, vence hoy                |
| `red-deep`         | `#A03B2D`| Texto sobre red-soft               |
| `red-soft`         | `#FADDD6`| Fondos chips rojo                  |
| `red-wash`         | `#FDEEEA`| Fondos sutiles rojo                |
| `bg`               | `#FAFAF7`| Background app (papel cálido)      |
| `surface`          | `#FFFFFF`| Cards, sheets                      |
| `surface-alt`      | `#F4F3EE`| Inputs, segmented backgrounds      |
| `border`           | `#E7E6E0`| Bordes normales                    |
| `border-soft`      | `#EFEEE9`| Dividers internos                  |
| `ink`              | `#1B221F`| Texto principal                    |
| `ink-soft`         | `#5C6460`| Texto secundario                   |
| `ink-mute`         | `#9AA09C`| Texto terciario, placeholders      |
| `ink-faint`        | `#C5C9C4`| Iconos deshabilitados, separadores |

### Tipografía

- **Familia primaria**: `Plus Jakarta Sans` (Google Fonts) — moderna, cálida, no genérica
- **Mono**: `JetBrains Mono` para meta/labels técnicos
- **Pesos**: 400, 500, 600, 700

Escala:

| Rol      | Tamaño | Peso | Letter-spacing |
|----------|--------|------|----------------|
| Display  | 28–36  | 700  | -0.6 a -1.0    |
| Title    | 17–20  | 700  | -0.3 a -0.4    |
| Body     | 14.5   | 500  | normal         |
| Caption  | 12     | 500  | normal         |
| Mono cap | 10–11  | 600  | 1.2–1.4 upper  |

### Radios

`sm:8` · `md:12` · `lg:16` · `xl:20` · `2xl:28` · `full:9999`

### Shadows

```
shadow-sm:    0 1px 2px rgba(27,34,31,.04), 0 1px 1px rgba(27,34,31,.04)
shadow-md:    0 4px 12px rgba(27,34,31,.06), 0 1px 3px rgba(27,34,31,.04)
shadow-lg:    0 12px 32px rgba(27,34,31,.10), 0 2px 6px rgba(27,34,31,.05)
shadow-float: 0 20px 48px rgba(27,34,31,.14), 0 4px 12px rgba(27,34,31,.06)
```

---

## Sample `tailwind.config.ts`

```ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        green: {
          DEFAULT: '#2F8F5C',
          deep:    '#1F6B43',
          soft:    '#E5F1E8',
          wash:    '#F2F8F3',
        },
        amber: {
          DEFAULT: '#E89F4D',
          deep:    '#B8772D',
          soft:    '#FBE9D2',
          wash:    '#FDF5EB',
        },
        red: {
          DEFAULT: '#D85B4A',
          deep:    '#A03B2D',
          soft:    '#FADDD6',
          wash:    '#FDEEEA',
        },
        bg:          '#FAFAF7',
        surface:     '#FFFFFF',
        'surface-alt':'#F4F3EE',
        border: {
          DEFAULT: '#E7E6E0',
          soft:    '#EFEEE9',
        },
        ink: {
          DEFAULT: '#1B221F',
          soft:    '#5C6460',
          mute:    '#9AA09C',
          faint:   '#C5C9C4',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        '2xl': '1.75rem', // 28px
      },
      boxShadow: {
        sm: '0 1px 2px rgba(27,34,31,0.04), 0 1px 1px rgba(27,34,31,0.04)',
        md: '0 4px 12px rgba(27,34,31,0.06), 0 1px 3px rgba(27,34,31,0.04)',
        lg: '0 12px 32px rgba(27,34,31,0.10), 0 2px 6px rgba(27,34,31,0.05)',
        float: '0 20px 48px rgba(27,34,31,0.14), 0 4px 12px rgba(27,34,31,0.06)',
      },
    },
  },
} satisfies Config;
```

---

## Componentes clave (a portar)

| Mockup                | Implementación sugerida (TSX)              |
|-----------------------|--------------------------------------------|
| `Button`              | `components/ui/button.tsx` con variants    |
| `Chip`                | `components/ui/chip.tsx`                   |
| `Card`                | `components/ui/card.tsx`                   |
| `Screen`              | layout wrapper con `safe-area` padding     |
| `TopBar`              | `components/ui/top-bar.tsx`                |
| `TabBar`              | `components/ui/tab-bar.tsx` (con Next router) |
| `CategoryIcon`        | wrapper sobre `Icon` + tokens de categoría |
| `SectionHeading`      | header reusable de sección                 |
| `DaysPill`            | helper que mapea `days → tone`             |
| `ProductRow`          | item de lista (despensa, dashboard, alertas)|
| `Gauge`               | círculo SVG animado para el score          |

---

## Iconografía

Set de iconos custom en `icons.jsx`. Todos son SVG 24×24, stroke 1.75px, line-cap round.

**Categorías**: dairy, meat, veg, fruit, bread, drinks, egg, pantry
**UI**: home, list, bell, user, scan, plus, minus, check, x, chevronLeft, chevronRight, chevronDown, search, filter, settings, calendar, clock, heart, edit, trash, flash, share, trending, sparkle, fridge, snow, open, closed, barcode

Para Claude Code: portar como componente `<Icon name="..." size={} />` con el mismo API.

---

## Tono UX (microcopy)

- **Empático y directo**, nunca culpogénico
- **Español neutro** (no "vos" ni "ustedes")
- Mensajes sugerentes, no imperativos: *"Te sugerimos…"*, *"Vas bien"*, *"Una idea para hoy"*
- Evitar: "perdiste", "desperdiciaste", "tirar otra vez"
- Preferir: "aprovechado", "a tiempo", "podés…"

Ejemplos del producto:
- > "Cuidá tu heladera, cuidá tu plata"
- > "Tu yogur natural vence hoy. Si lo abrís ahora, todavía está en su mejor momento."
- > "Vas mejor que la semana pasada"
- > "Una idea para hoy" (no "deberías usar…")

---

## Pantallas incluidas

| # | Pantalla              | Archivo de referencia         | Notas de implementación                              |
|---|-----------------------|-------------------------------|------------------------------------------------------|
| 1 | Onboarding 1/3        | `screen-onboarding.jsx`       | 3 slides con dots indicator + skip                   |
| 2 | Onboarding 2/3        | `screen-onboarding.jsx`       | Slide de escaneo                                     |
| 3 | Onboarding 3/3        | `screen-onboarding.jsx`       | Permission ask para notificaciones                   |
| 4 | Dashboard / Inicio    | `screen-dashboard.jsx`        | Score gauge + 3 stats + próximos a vencer + mini-rep |
| 5 | Despensa              | `screen-despensa.jsx`         | Search + chips + grouped lists                       |
| 6 | Detalle producto      | `screen-detalle.jsx`          | Timeline + countdown + recipe suggestion             |
| 7 | Alertas               | `screen-alertas.jsx`          | Feed conversacional, agrupado por día                |
| 8 | Escaneo               | `screen-escaneo.jsx`          | Camera viewfinder + bottom sheet de confirmación     |
| 9 | Agregar manual        | `screen-agregar.jsx`          | Form: nombre / categoría / estado / fecha / cantidad |
|10 | Reporte mensual       | `screen-reporte.jsx`          | Hero stat + breakdown por categoría + highlights     |

---

## Decisiones de diseño relevantes

- **Mapeo automático urgencia → color**: en `tokens.jsx::urgencyTone(days)`. `≤1`: rojo, `≤4`: ámbar, `>4`: verde. Portar a `lib/urgency.ts`.
- **Sin emojis en UI** (excepto microcopy ocasional como "🥑"). Toda iconografía es SVG custom.
- **Sin fotos de producto**: iconos por categoría (`CategoryIcon`) — más rápido, más coherente, no requiere CDN de fotos.
- **Plus Jakarta Sans en lugar de Inter/Roboto**: pedido del brief (carácter propio).
- **Papel cálido (`#FAFAF7`) en lugar de blanco puro**: refuerza calidez latinoamericana.

---

## Próximos pasos sugeridos (después del setup)

1. Setup base: tailwind config + fonts + estructura de carpetas
2. Componentes UI primitivos (`Button`, `Chip`, `Card`, `Icon`)
3. Layout principal con TabBar
4. Estado global de productos (Zustand o Context + IndexedDB para PWA offline)
5. Pantallas en este orden: Dashboard → Despensa → Detalle → Alertas → Escaneo → Agregar → Reporte → Onboarding
6. PWA manifest + service worker
7. Push notifications (Web Push API)
8. Integración con API de códigos de barras (Open Food Facts es gratis y tiene buena cobertura LATAM)

---

## Contacto del diseño

Cualquier duda al implementar, abrir `FoodSense Hi-Fi.html` en un navegador — todas las pantallas se pueden ver lado a lado en el canvas, con foco fullscreen disponible.
