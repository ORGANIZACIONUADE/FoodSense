// icons.jsx — FoodSense custom icon set
// Organic outline icons, ~1.75px stroke, rounded caps/joins. All 24×24.
// Components: <Icon name="..." size={...} color={...} fill={...} />

const ICON_PATHS = {
  // ─── UI / Nav ──────────────────────────────────────────────
  home: (
    <>
      <path d="M4 11.5 12 5l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5H14V15h-4v5.5H5.5A1.5 1.5 0 0 1 4 19v-7.5Z"/>
    </>
  ),
  list: (
    <>
      <path d="M4 7h16M4 12h16M4 17h10"/>
    </>
  ),
  bell: (
    <>
      <path d="M6 10a6 6 0 0 1 12 0c0 4 1.5 5.5 2 6.5H4c.5-1 2-2.5 2-6.5Z"/>
      <path d="M10 19.5a2 2 0 0 0 4 0"/>
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.5" r="3.5"/>
      <path d="M5 20c.8-3.6 3.8-6 7-6s6.2 2.4 7 6"/>
    </>
  ),
  scan: (
    <>
      <path d="M4 9V6a2 2 0 0 1 2-2h3M20 9V6a2 2 0 0 0-2-2h-3M4 15v3a2 2 0 0 0 2 2h3M20 15v3a2 2 0 0 1-2 2h-3"/>
      <path d="M8 12h8"/>
    </>
  ),

  plus: <path d="M12 5v14M5 12h14"/>,
  minus: <path d="M5 12h14"/>,
  check: <path d="m5 12.5 4.5 4.5L19 7"/>,
  x: <path d="m6 6 12 12M18 6 6 18"/>,
  chevronLeft: <path d="m14 6-6 6 6 6"/>,
  chevronRight: <path d="m10 6 6 6-6 6"/>,
  chevronDown: <path d="m6 10 6 6 6-6"/>,
  search: (
    <>
      <circle cx="11" cy="11" r="6"/>
      <path d="m20 20-4.5-4.5"/>
    </>
  ),
  filter: <path d="M4 6h16M7 12h10M10 18h4"/>,
  settings: (
    <>
      <circle cx="12" cy="12" r="2.5"/>
      <path d="M19.4 14a1.5 1.5 0 0 0 .3 1.7l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.5 1.5 0 0 0-1.7-.3 1.5 1.5 0 0 0-.9 1.4V20a2 2 0 1 1-4 0v-.1a1.5 1.5 0 0 0-1-1.3 1.5 1.5 0 0 0-1.7.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.5 1.5 0 0 0 .3-1.7 1.5 1.5 0 0 0-1.4-.9H4a2 2 0 1 1 0-4h.1a1.5 1.5 0 0 0 1.3-1 1.5 1.5 0 0 0-.3-1.7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.5 1.5 0 0 0 1.7.3H10a1.5 1.5 0 0 0 .9-1.4V4a2 2 0 1 1 4 0v.1a1.5 1.5 0 0 0 .9 1.4 1.5 1.5 0 0 0 1.7-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.5 1.5 0 0 0-.3 1.7V10a1.5 1.5 0 0 0 1.4.9H20a2 2 0 1 1 0 4h-.1a1.5 1.5 0 0 0-1.4.9Z"/>
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="6" width="16" height="14" rx="2.5"/>
      <path d="M4 10h16M8.5 4v4M15.5 4v4"/>
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8"/>
      <path d="M12 8v4l2.5 2"/>
    </>
  ),
  heart: <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z"/>,
  edit: (
    <>
      <path d="M4 20h4l10.5-10.5a2 2 0 0 0-2.8-2.8L5.2 17.2"/>
      <path d="M14 7.5 16.5 10"/>
    </>
  ),
  trash: (
    <>
      <path d="M5 7h14M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>
      <path d="M7 7v12.5A1.5 1.5 0 0 0 8.5 21h7a1.5 1.5 0 0 0 1.5-1.5V7"/>
    </>
  ),
  flash: <path d="M13 3 5 14h6l-1 7 8-11h-6l1-7Z"/>,
  flashOff: (
    <>
      <path d="M13 3 5 14h6l-1 7 8-11h-6l1-7Z"/>
      <path d="m4 4 16 16"/>
    </>
  ),
  share: (
    <>
      <path d="M12 4v12M8 8l4-4 4 4"/>
      <path d="M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"/>
    </>
  ),
  trending: (
    <>
      <path d="m4 17 6-6 4 4 6-8"/>
      <path d="M14 7h6v6"/>
    </>
  ),
  sparkle: <path d="M12 4v3M12 17v3M4 12h3M17 12h3M6.5 6.5l2 2M15.5 15.5l2 2M6.5 17.5l2-2M15.5 8.5l2-2"/>,
  fridge: (
    <>
      <rect x="6" y="3" width="12" height="18" rx="2.5"/>
      <path d="M6 11h12M10 7.5v1.5M10 14v2"/>
    </>
  ),
  snow: <path d="M12 4v16M4 12h16M6.5 6.5l11 11M17.5 6.5l-11 11"/>,
  open: (
    <>
      <path d="M5 9V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3"/>
      <path d="M4 9h16v9.5A1.5 1.5 0 0 1 18.5 20h-13A1.5 1.5 0 0 1 4 18.5V9Z"/>
      <path d="M10 13.5h4"/>
    </>
  ),
  closed: (
    <>
      <rect x="4" y="6" width="16" height="14" rx="2"/>
      <path d="M9 6V4.5C9 4 9.4 3.5 10 3.5h4c.6 0 1 .4 1 1V6"/>
    </>
  ),
  barcode: (
    <>
      <path d="M5 6v12M8 6v12M11 6v12M14 6v12M17 6v12M20 6v12"/>
    </>
  ),
  // ─── Categorías ────────────────────────────────────────────
  dairy: (
    <>
      <path d="M7 3h10l-1.5 4v12.5A1.5 1.5 0 0 1 14 21h-4a1.5 1.5 0 0 1-1.5-1.5V7L7 3Z"/>
      <path d="M8.5 11c1.5 1 3.5-1 5 0v3c-1.5-1-3.5 1-5 0v-3Z"/>
    </>
  ),
  meat: (
    <>
      <path d="M14.5 4a5.5 5.5 0 0 1 4 9.4l-6.6 6.6a3 3 0 0 1-4.3-4.3l6.6-6.6A5.5 5.5 0 0 1 14.5 4Z"/>
      <circle cx="10" cy="14" r="1.2"/>
    </>
  ),
  veg: (
    <>
      <path d="M5 19c4-9 11-12 14-14 0 6-2 14-11 14-1.5 0-2.5-.4-3-1.5C5 17.5 5 18 5 19Z"/>
      <path d="M12 12c2-2 5-4 7-5"/>
    </>
  ),
  fruit: (
    <>
      <path d="M12 8c-4 0-7 2.5-7 7s3 5.5 7 5.5 7-1 7-5.5-3-7-7-7Z"/>
      <path d="M12 8c0-2 1-4 3-5M12 8c-.5-1-1-1.5-2-2"/>
    </>
  ),
  bread: (
    <>
      <path d="M4 11a4 4 0 0 1 5-4 4 4 0 0 1 6 0 4 4 0 0 1 5 4v6.5A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5V11Z"/>
      <path d="M9 12.5v3M12 12.5v3M15 12.5v3"/>
    </>
  ),
  drinks: (
    <>
      <path d="M9 3h6v3l1 1v12.5A1.5 1.5 0 0 1 14.5 21h-5A1.5 1.5 0 0 1 8 19.5V7l1-1V3Z"/>
      <path d="M8 11h8"/>
    </>
  ),
  egg: <path d="M12 3c-3.5 0-6 4.5-6 9s2.5 8 6 8 6-3.5 6-8-2.5-9-6-9Z"/>,
  pantry: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2"/>
      <path d="M4 11h16M9 7.5v1.5M9 14v1.5"/>
    </>
  ),
};

function Icon({ name, size = 24, color = 'currentColor', fill = 'none', strokeWidth = 1.75, style = {}, ...rest }) {
  const path = ICON_PATHS[name];
  if (!path) return null;
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill={fill} stroke={color} strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, ...style }}
      {...rest}
    >
      {path}
    </svg>
  );
}

// category meta — used by chips, list rows, etc.
const CATEGORIES = {
  lacteos:     { label: 'Lácteos',     icon: 'dairy',  tint: '#EAF2FB', stroke: '#3E7CB1' },
  carnes:      { label: 'Carnes',      icon: 'meat',   tint: '#FAE5DC', stroke: '#B5573B' },
  verduras:    { label: 'Verduras',    icon: 'veg',    tint: '#E5F1E8', stroke: '#2F8F5C' },
  frutas:      { label: 'Frutas',      icon: 'fruit',  tint: '#FBE9D2', stroke: '#B8772D' },
  panificados: { label: 'Panificados', icon: 'bread',  tint: '#F5EBD8', stroke: '#8A6A2E' },
  bebidas:     { label: 'Bebidas',     icon: 'drinks', tint: '#E6EEF1', stroke: '#3A6F7E' },
  huevos:      { label: 'Huevos',      icon: 'egg',    tint: '#FAF5E6', stroke: '#9C7A2E' },
  conservas:   { label: 'Conservas',   icon: 'pantry', tint: '#F0EBE3', stroke: '#5C6460' },
};

Object.assign(window, { Icon, CATEGORIES });
