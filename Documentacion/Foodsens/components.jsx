// components.jsx — FoodSense UI primitives
// Reusable atoms used across all screens. These mirror the components
// the dev should produce in Next.js/Tailwind (Button, Chip, Card, etc).

// ─── Button ─────────────────────────────────────────────────
function Button({
  children, variant = 'primary', size = 'md', leading, trailing,
  full = false, style = {}, ...rest
}) {
  const variants = {
    primary:   { bg: T.green,       fg: '#fff',       border: T.green },
    secondary: { bg: T.surface,     fg: T.ink,        border: T.border },
    ghost:     { bg: 'transparent', fg: T.green,      border: 'transparent' },
    danger:    { bg: T.surface,     fg: T.red,        border: T.redSoft },
    amber:     { bg: T.amber,       fg: '#fff',       border: T.amber },
  };
  const sizes = {
    sm: { h: 36, px: 14, fs: 13, gap: 6 },
    md: { h: 48, px: 18, fs: 15, gap: 8 },
    lg: { h: 56, px: 22, fs: 16, gap: 10 },
  };
  const v = variants[variant]; const s = sizes[size];
  return (
    <button style={{
      height: s.h, padding: `0 ${s.px}px`, gap: s.gap,
      borderRadius: T.rFull, border: `1.25px solid ${v.border}`,
      background: v.bg, color: v.fg, fontFamily: T.font,
      fontSize: s.fs, fontWeight: 600, letterSpacing: -0.1,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', width: full ? '100%' : 'auto',
      boxShadow: variant === 'primary' || variant === 'amber' ? T.shadowSm : 'none',
      ...style,
    }} {...rest}>
      {leading}
      <span>{children}</span>
      {trailing}
    </button>
  );
}

// ─── Chip / Tag ─────────────────────────────────────────────
function Chip({ children, tone = 'neutral', solid = false, leading, style = {} }) {
  const tones = {
    neutral: { fg: T.ink,       bg: T.surfaceAlt, border: T.border,    solidBg: T.ink,    solidFg: '#fff' },
    green:   { fg: T.greenDeep, bg: T.greenSoft,  border: T.greenSoft, solidBg: T.green,  solidFg: '#fff' },
    amber:   { fg: T.amberDeep, bg: T.amberSoft,  border: T.amberSoft, solidBg: T.amber,  solidFg: '#fff' },
    red:     { fg: T.redDeep,   bg: T.redSoft,    border: T.redSoft,   solidBg: T.red,    solidFg: '#fff' },
  };
  const t = tones[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '5px 11px', borderRadius: T.rFull,
      border: solid ? `1px solid ${t.solidBg}` : `1px solid ${t.border}`,
      background: solid ? t.solidBg : t.bg,
      color: solid ? t.solidFg : t.fg,
      fontFamily: T.font, fontSize: 12, fontWeight: 600,
      letterSpacing: -0.1, lineHeight: 1.3, whiteSpace: 'nowrap',
      ...style,
    }}>
      {leading}{children}
    </span>
  );
}

// ─── Card ───────────────────────────────────────────────────
function Card({ children, padding = 16, style = {}, elevated = false, accent }) {
  return (
    <div style={{
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: T.rLg,
      padding,
      boxShadow: elevated ? T.shadowMd : 'none',
      position: 'relative',
      ...style,
    }}>
      {accent && (
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
          background: accent, borderRadius: `${T.rLg}px 0 0 ${T.rLg}px`,
        }} />
      )}
      {children}
    </div>
  );
}

// ─── Phone screen wrapper ───────────────────────────────────
function Screen({ children, bg = T.bg, scroll = true, padTop = 56, padBottom = 92 }) {
  return (
    <div style={{
      width: '100%', height: '100%', background: bg,
      fontFamily: T.font, color: T.ink,
      position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        flex: 1,
        overflow: scroll ? 'auto' : 'hidden',
        paddingTop: padTop, paddingBottom: padBottom,
      }}>
        {children}
      </div>
    </div>
  );
}

// ─── Top bar (compact) ──────────────────────────────────────
function TopBar({ leading, title, trailing, transparent = true, sticky = true }) {
  return (
    <div style={{
      position: sticky ? 'absolute' : 'static',
      top: sticky ? 50 : 0, left: 0, right: 0, zIndex: 5,
      padding: '6px 18px',
      display: 'flex', alignItems: 'center', gap: 10,
      background: transparent ? 'transparent' : T.bg,
    }}>
      {leading && (
        <div style={{
          width: 40, height: 40, borderRadius: T.rFull,
          background: T.surface, border: `1px solid ${T.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: T.ink, boxShadow: T.shadowSm,
        }}>{leading}</div>
      )}
      <div style={{ flex: 1, fontSize: 16, fontWeight: 700, textAlign: 'center', letterSpacing: -0.2 }}>
        {title}
      </div>
      {trailing && (
        <div style={{
          width: 40, height: 40, borderRadius: T.rFull,
          background: T.surface, border: `1px solid ${T.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: T.ink, boxShadow: T.shadowSm,
        }}>{trailing}</div>
      )}
    </div>
  );
}

// ─── Bottom Tab Bar ─────────────────────────────────────────
function TabBar({ active = 'home' }) {
  const tabs = [
    { id: 'home',     icon: 'home',  label: 'Inicio'   },
    { id: 'pantry',   icon: 'list',  label: 'Despensa' },
    { id: 'scan',     icon: 'scan',  label: 'Escanear', primary: true },
    { id: 'alerts',   icon: 'bell',  label: 'Alertas'  },
    { id: 'profile',  icon: 'user',  label: 'Yo'       },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      paddingBottom: 28, paddingTop: 8, background: T.surface,
      borderTop: `1px solid ${T.border}`,
      display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end',
      zIndex: 10,
    }}>
      {tabs.map((t) => {
        const isActive = t.id === active;
        if (t.primary) {
          return (
            <div key={t.id} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: T.rFull,
                background: T.green, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginTop: -22, boxShadow: T.shadowLg,
                border: `3px solid ${T.surface}`,
              }}>
                <Icon name={t.icon} size={24} />
              </div>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: T.inkSoft }}>{t.label}</div>
            </div>
          );
        }
        return (
          <div key={t.id} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            color: isActive ? T.green : T.inkMute,
            position: 'relative',
          }}>
            <Icon name={t.icon} size={22} strokeWidth={isActive ? 2.25 : 1.75} />
            <div style={{ fontSize: 10.5, fontWeight: isActive ? 700 : 500 }}>{t.label}</div>
            {isActive && (
              <div style={{
                position: 'absolute', top: -8, width: 4, height: 4, borderRadius: T.rFull,
                background: T.green,
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Category icon block ────────────────────────────────────
function CategoryIcon({ category, size = 44 }) {
  const c = CATEGORIES[category] || CATEGORIES.conservas;
  return (
    <div style={{
      width: size, height: size, borderRadius: T.rMd,
      background: c.tint, color: c.stroke,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <Icon name={c.icon} size={Math.round(size * 0.58)} strokeWidth={1.75} />
    </div>
  );
}

// ─── Section heading ────────────────────────────────────────
function SectionHeading({ children, kicker, trailing, style = {} }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      padding: '0 18px', marginBottom: 12, ...style,
    }}>
      <div>
        {kicker && (
          <div style={{
            fontFamily: T.fontMono, fontSize: 10, letterSpacing: 1.4,
            textTransform: 'uppercase', color: T.inkMute, marginBottom: 3,
          }}>{kicker}</div>
        )}
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.3 }}>{children}</div>
      </div>
      {trailing}
    </div>
  );
}

// ─── Days-to-expiry pill ────────────────────────────────────
function DaysPill({ days, style = {} }) {
  const tone = urgencyTone(days);
  const label =
    days === 0 ? 'hoy' :
    days === 1 ? 'mañana' :
    days < 7   ? `${days} días` :
    days < 30  ? `${Math.round(days/7)} sem` :
                 `${Math.round(days/30)} mes`;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '4px 10px', borderRadius: T.rFull,
      background: tone.bg, color: tone.fg,
      fontFamily: T.fontMono, fontSize: 11, fontWeight: 700,
      letterSpacing: -0.1, textTransform: 'lowercase',
      ...style,
    }}>
      {label}
    </div>
  );
}

// ─── Product list row ───────────────────────────────────────
function ProductRow({ name, category, state, days, divider = true, action }) {
  const cat = CATEGORIES[category];
  const stateMap = {
    cerrado:   { icon: 'closed', label: 'Cerrado' },
    abierto:   { icon: 'open',   label: 'Abierto' },
    congelado: { icon: 'snow',   label: 'Congelado' },
  };
  const st = stateMap[state] || stateMap.cerrado;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 0',
      borderBottom: divider ? `1px solid ${T.borderSoft}` : 'none',
    }}>
      <CategoryIcon category={category} size={44}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14.5, fontWeight: 600, letterSpacing: -0.2 }}>{name}</div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 11.5, color: T.inkSoft, marginTop: 2,
        }}>
          <span>{cat?.label || category}</span>
          <span style={{ color: T.inkFaint }}>·</span>
          <Icon name={st.icon} size={12} color={T.inkSoft}/>
          <span>{st.label}</span>
        </div>
      </div>
      {typeof days === 'number' ? <DaysPill days={days}/> : action}
    </div>
  );
}

Object.assign(window, {
  Button, Chip, Card, Screen, TopBar, TabBar,
  CategoryIcon, SectionHeading, DaysPill, ProductRow,
});
