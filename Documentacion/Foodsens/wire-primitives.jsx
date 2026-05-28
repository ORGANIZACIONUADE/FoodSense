// wire-primitives.jsx — shared wireframe tokens + atoms

const W = {
  ink: '#1f1c19',
  inkSoft: '#5b5650',
  inkMute: '#9a948b',
  paper: '#fbfaf6',
  paperAlt: '#f3efe6',
  rule: '#2a2520',
  green: '#4d8a4f',     // fresh green accent
  greenSoft: '#dfece0',
  amber: '#d97a2e',     // amber accent
  amberSoft: '#f7e4cf',
  red: '#c0533c',
  redSoft: '#f4d8d0',
  font: '"Outfit", -apple-system, system-ui, sans-serif',
  hand: '"Caveat", "Patrick Hand", cursive',
  mono: '"JetBrains Mono", ui-monospace, Menlo, monospace',
};

// dashed wireframe placeholder box, with optional label
function WPlaceholder({ label, h = 120, w = '100%', radius = 12, dashed = true, style = {} }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: radius,
      border: dashed ? `1.25px dashed ${W.inkMute}` : `1.25px solid ${W.rule}`,
      background: `repeating-linear-gradient(135deg, transparent 0 8px, rgba(0,0,0,0.025) 8px 9px)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: W.inkSoft, fontFamily: W.mono, fontSize: 11, letterSpacing: 0.3,
      textTransform: 'uppercase',
      ...style,
    }}>
      {label}
    </div>
  );
}

// solid wireframe card
function WCard({ children, style = {}, accent, padding = 14 }) {
  return (
    <div style={{
      border: `1.25px solid ${W.rule}`, borderRadius: 14,
      background: W.paper, padding, position: 'relative',
      ...style,
    }}>
      {accent && (
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
          background: accent, borderRadius: '14px 0 0 14px',
        }} />
      )}
      {children}
    </div>
  );
}

// chip / pill
function WChip({ children, color = W.ink, bg = 'transparent', solid = false, style = {} }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 10px', borderRadius: 999,
      border: `1px solid ${solid ? color : W.rule}`,
      background: solid ? color : bg,
      color: solid ? '#fff' : color,
      fontFamily: W.font, fontSize: 11, fontWeight: 500,
      letterSpacing: 0.1, lineHeight: 1.4, whiteSpace: 'nowrap',
      ...style,
    }}>{children}</span>
  );
}

// section heading
function WHeading({ children, kicker, style = {} }) {
  return (
    <div style={{ ...style }}>
      {kicker && (
        <div style={{
          fontFamily: W.mono, fontSize: 10, letterSpacing: 1.5,
          textTransform: 'uppercase', color: W.inkMute, marginBottom: 4,
        }}>{kicker}</div>
      )}
      <div style={{
        fontFamily: W.font, fontSize: 17, fontWeight: 600,
        color: W.ink, letterSpacing: -0.2,
      }}>{children}</div>
    </div>
  );
}

// margin annotation (handwritten Caveat)
function WNote({ children, color = W.amber, arrow = false, style = {} }) {
  return (
    <div style={{
      fontFamily: W.hand, fontSize: 17, color, lineHeight: 1.1,
      display: 'flex', alignItems: 'flex-start', gap: 4,
      ...style,
    }}>
      {arrow && <span style={{ fontSize: 18, lineHeight: 1 }}>↳</span>}
      <span>{children}</span>
    </div>
  );
}

// iOS-ish bottom tab bar (wireframe style)
function WTabBar({ active = 0 }) {
  const tabs = [
    { label: 'Inicio', icon: '⌂' },
    { label: 'Despensa', icon: '☰' },
    { label: 'Escanear', icon: '◎', primary: true },
    { label: 'Alertas', icon: '◐' },
    { label: 'Perfil', icon: '○' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      paddingBottom: 28, paddingTop: 10, background: W.paper,
      borderTop: `1px solid ${W.rule}`,
      display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end',
      fontFamily: W.font,
    }}>
      {tabs.map((t, i) => {
        const isActive = i === active;
        const isPrimary = t.primary;
        return (
          <div key={i} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            color: isActive ? W.green : W.inkSoft,
          }}>
            {isPrimary ? (
              <div style={{
                width: 46, height: 46, borderRadius: 999,
                border: `1.5px solid ${W.rule}`, background: W.greenSoft,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginTop: -22, fontSize: 22, color: W.ink,
              }}>{t.icon}</div>
            ) : (
              <div style={{ fontSize: 18, lineHeight: 1 }}>{t.icon}</div>
            )}
            <div style={{ fontSize: 10, fontWeight: isActive ? 600 : 400 }}>{t.label}</div>
          </div>
        );
      })}
    </div>
  );
}

// iOS-ish status bar (wireframe simplified)
function WStatusBar() {
  return (
    <div style={{
      height: 44, padding: '0 22px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      fontFamily: W.font, fontSize: 14, fontWeight: 600, color: W.ink,
      flexShrink: 0,
    }}>
      <span>9:41</span>
      <span style={{ display: 'flex', gap: 4, alignItems: 'center', fontSize: 10 }}>
        <span>▮▮▮▮</span><span>●●</span><span style={{
          display: 'inline-block', width: 22, height: 11, border: `1px solid ${W.ink}`,
          borderRadius: 3, position: 'relative',
        }}>
          <span style={{
            position: 'absolute', inset: 1.5, width: 14, background: W.ink, borderRadius: 1,
          }} />
        </span>
      </span>
    </div>
  );
}

// phone screen wrapper — fills the device interior with paper bg.
// Leaves room at the top for the iOS frame's status bar (which is
// rendered by IOSDevice, absolutely positioned).
function WScreen({ children, bg = W.paper }) {
  return (
    <div style={{
      width: '100%', height: '100%', background: bg,
      display: 'flex', flexDirection: 'column',
      fontFamily: W.font, color: W.ink,
      position: 'relative', overflow: 'hidden',
      paddingTop: 56, // clear the iOS status bar + dynamic island
    }}>
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {children}
      </div>
    </div>
  );
}

// product row line (used in despensa / dashboard)
function WProductRow({ name, meta, days, state, accent }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 0', borderBottom: `1px dashed ${W.inkMute}`,
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 10,
        border: `1px solid ${W.rule}`, background: accent || W.paperAlt,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: W.mono, fontSize: 9, color: W.inkSoft,
      }}>img</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{name}</div>
        <div style={{ fontSize: 11, color: W.inkSoft, marginTop: 1 }}>{meta}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontFamily: W.mono, fontSize: 12, fontWeight: 600, color: state }}>
          {days}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  W, WPlaceholder, WCard, WChip, WHeading, WNote, WTabBar, WStatusBar, WScreen, WProductRow,
});
