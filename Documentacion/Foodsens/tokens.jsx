// tokens.jsx — FoodSense design tokens
// Single source of truth for color, type, spacing, radii, shadows.
// When exporting to Claude Code these map 1:1 to tailwind.config.js.

const T = {
  // ─── Color ───────────────────────────────────────────────────
  // Primary — verde fresco (productos frescos, acción positiva)
  green:       '#2F8F5C',
  greenDeep:   '#1F6B43',
  greenSoft:   '#E5F1E8',
  greenWash:   '#F2F8F3',

  // Accent — ámbar (atención cercana, calidez latinoamericana)
  amber:       '#E89F4D',
  amberDeep:   '#B8772D',
  amberSoft:   '#FBE9D2',
  amberWash:   '#FDF5EB',

  // Danger — rojo cálido (vence hoy, urgente)
  red:         '#D85B4A',
  redDeep:     '#A03B2D',
  redSoft:     '#FADDD6',
  redWash:     '#FDEEEA',

  // Neutrals — papel cálido, no blanco frío
  bg:          '#FAFAF7',
  surface:     '#FFFFFF',
  surfaceAlt:  '#F4F3EE',
  border:      '#E7E6E0',
  borderSoft:  '#EFEEE9',
  ink:         '#1B221F',
  inkSoft:     '#5C6460',
  inkMute:     '#9AA09C',
  inkFaint:    '#C5C9C4',

  // ─── Type ────────────────────────────────────────────────────
  // Plus Jakarta Sans — moderna, cálida, con personalidad propia.
  // No Inter/Roboto. Soporte latín completo para ES/PT.
  font:        '"Plus Jakarta Sans", -apple-system, system-ui, sans-serif',
  fontMono:    '"JetBrains Mono", ui-monospace, Menlo, monospace',

  // ─── Radii ───────────────────────────────────────────────────
  rSm:  8,
  rMd:  12,
  rLg:  16,
  rXl:  20,
  r2xl: 28,
  rFull: 9999,

  // ─── Shadows ────────────────────────────────────────────────
  shadowSm:  '0 1px 2px rgba(27,34,31,0.04), 0 1px 1px rgba(27,34,31,0.04)',
  shadowMd:  '0 4px 12px rgba(27,34,31,0.06), 0 1px 3px rgba(27,34,31,0.04)',
  shadowLg:  '0 12px 32px rgba(27,34,31,0.10), 0 2px 6px rgba(27,34,31,0.05)',
  shadowFloat: '0 20px 48px rgba(27,34,31,0.14), 0 4px 12px rgba(27,34,31,0.06)',
};

// urgency → color tone (helper used across screens)
function urgencyTone(days) {
  if (days <= 1)  return { fg: T.red,   bg: T.redSoft,   wash: T.redWash,   label: 'urgente' };
  if (days <= 4)  return { fg: T.amber, bg: T.amberSoft, wash: T.amberWash, label: 'pronto' };
  return { fg: T.green, bg: T.greenSoft, wash: T.greenWash, label: 'a tiempo' };
}

Object.assign(window, { T, urgencyTone });
