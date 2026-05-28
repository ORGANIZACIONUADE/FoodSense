// screens-despensa.jsx — 2 variations of Despensa (listado)

// ─────────────────────────────────────────────────────────────
// V1: Listado por categoría con filtros y agrupación
// ─────────────────────────────────────────────────────────────
function DespensaA() {
  const cats = [
    { name: 'Lácteos', count: 6, items: [
      { name: 'Yogur natural', state: 'Abierto', days: 'Hoy', tone: W.red },
      { name: 'Queso cremoso', state: 'Abierto', days: '4 d', tone: W.amber },
      { name: 'Leche entera', state: 'Cerrado', days: '8 d', tone: W.ink },
    ]},
    { name: 'Verduras', count: 5, items: [
      { name: 'Lechuga mantecosa', state: 'Cerrado', days: '2 d', tone: W.amber },
      { name: 'Tomate perita', state: 'Cerrado', days: '6 d', tone: W.ink },
    ]},
    { name: 'Carnes', count: 4, items: [
      { name: 'Pollo trozado', state: 'Congelado', days: '30 d', tone: W.green },
    ]},
  ];
  return (
    <WScreen>
      {/* sticky header */}
      <div style={{ padding: '4px 18px 10px', borderBottom: `1px solid ${W.paperAlt}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.4 }}>Despensa</div>
          <div style={{
            width: 32, height: 32, borderRadius: 999, border: `1px solid ${W.rule}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
          }}>+</div>
        </div>
        {/* search */}
        <div style={{
          height: 36, borderRadius: 10, border: `1px solid ${W.rule}`, background: W.paperAlt,
          display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8, marginBottom: 10,
        }}>
          <span style={{ fontSize: 13, color: W.inkMute }}>⌕</span>
          <span style={{ fontSize: 13, color: W.inkMute }}>Buscar en la despensa…</span>
        </div>
        {/* filter chips */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
          <WChip solid color={W.ink}>Todos · 24</WChip>
          <WChip>Lácteos</WChip>
          <WChip>Carnes</WChip>
          <WChip>Verduras</WChip>
          <WChip>Frutas</WChip>
          <WChip>Otros</WChip>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 18px 100px' }}>
        {/* state filter row */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          <WChip color={W.green} bg={W.greenSoft}>● Cerrado · 14</WChip>
          <WChip color={W.amber} bg={W.amberSoft}>◐ Abierto · 7</WChip>
          <WChip color={W.ink} bg={W.paperAlt}>❄ Congelado · 3</WChip>
        </div>

        {cats.map((cat, ci) => (
          <div key={ci} style={{ marginBottom: 18 }}>
            <div style={{
              display: 'flex', alignItems: 'baseline', gap: 8,
              padding: '4px 0 8px',
            }}>
              <div style={{ fontFamily: W.mono, fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: W.inkSoft }}>{cat.name}</div>
              <div style={{ flex: 1, height: 1, background: W.inkMute, opacity: 0.4 }} />
              <div style={{ fontFamily: W.mono, fontSize: 10, color: W.inkMute }}>{cat.count} ítems</div>
            </div>
            <WCard padding={0} style={{ padding: '4px 14px' }}>
              {cat.items.map((it, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 0',
                  borderBottom: i < cat.items.length - 1 ? `1px dashed ${W.inkMute}` : 'none',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    border: `1px solid ${W.rule}`, background: W.paperAlt,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: W.mono, fontSize: 9, color: W.inkSoft,
                  }}>img</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{it.name}</div>
                    <div style={{ fontSize: 11, color: W.inkSoft, marginTop: 1 }}>{it.state}</div>
                  </div>
                  <div style={{
                    fontFamily: W.mono, fontSize: 11, fontWeight: 700, color: it.tone,
                    padding: '4px 8px', borderRadius: 6,
                    background: it.tone === W.red ? W.redSoft : it.tone === W.amber ? W.amberSoft : it.tone === W.green ? W.greenSoft : W.paperAlt,
                  }}>{it.days}</div>
                </div>
              ))}
            </WCard>
          </div>
        ))}
      </div>

      <WTabBar active={1} />
    </WScreen>
  );
}

// ─────────────────────────────────────────────────────────────
// V2: Grid visual por urgencia, ordenable, con tabs
// ─────────────────────────────────────────────────────────────
function DespensaB() {
  const tabs = ['Todo · 24', 'Por vencer · 10', 'Congelado · 3'];
  const items = [
    { name: 'Yogur natural', cat: 'Lácteos', days: 'Hoy', tone: W.red, bg: W.redSoft, state: '◐' },
    { name: 'Lechuga', cat: 'Verduras', days: '2 d', tone: W.amber, bg: W.amberSoft, state: '●' },
    { name: 'Queso cremoso', cat: 'Lácteos', days: '4 d', tone: W.amber, bg: W.amberSoft, state: '◐' },
    { name: 'Tomate perita', cat: 'Verduras', days: '6 d', tone: W.ink, bg: W.paperAlt, state: '●' },
    { name: 'Leche entera', cat: 'Lácteos', days: '8 d', tone: W.ink, bg: W.paperAlt, state: '●' },
    { name: 'Pollo trozado', cat: 'Carnes', days: '30 d', tone: W.green, bg: W.greenSoft, state: '❄' },
  ];
  return (
    <WScreen>
      {/* header */}
      <div style={{ padding: '4px 18px 8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.4 }}>Despensa</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 999, border: `1px solid ${W.rule}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>⌕</div>
            <div style={{ width: 32, height: 32, borderRadius: 999, border: `1px solid ${W.rule}`, background: W.greenSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>+</div>
          </div>
        </div>

        {/* segmented tabs */}
        <div style={{
          border: `1px solid ${W.rule}`, borderRadius: 10, padding: 3,
          background: W.paperAlt, display: 'flex',
        }}>
          {tabs.map((t, i) => (
            <div key={i} style={{
              flex: 1, padding: '6px 4px', borderRadius: 7,
              fontSize: 11, fontWeight: 600, textAlign: 'center',
              background: i === 1 ? W.paper : 'transparent',
              border: i === 1 ? `1px solid ${W.rule}` : 'none',
              color: i === 1 ? W.ink : W.inkSoft,
            }}>{t}</div>
          ))}
        </div>
      </div>

      {/* sort row */}
      <div style={{ padding: '8px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: W.mono, fontSize: 10, color: W.inkMute, letterSpacing: 1.2, textTransform: 'uppercase' }}>10 productos por vencer</div>
        <div style={{ fontSize: 11, color: W.inkSoft, display: 'flex', gap: 4, alignItems: 'center' }}>
          <span>Ordenar:</span><span style={{ fontWeight: 600, color: W.ink }}>Urgencia ↓</span>
        </div>
      </div>

      {/* grid */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 18px 100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {items.map((it, i) => (
            <div key={i} style={{
              border: `1.25px solid ${W.rule}`, borderRadius: 12,
              background: W.paper, overflow: 'hidden',
            }}>
              {/* image area */}
              <div style={{
                aspectRatio: '1.4 / 1', background: it.bg,
                position: 'relative',
                borderBottom: `1px solid ${W.rule}`,
                backgroundImage: `repeating-linear-gradient(135deg, transparent 0 8px, rgba(0,0,0,0.025) 8px 9px)`,
              }}>
                <div style={{
                  position: 'absolute', top: 6, left: 6,
                  padding: '2px 6px', borderRadius: 4,
                  background: W.paper, border: `1px solid ${W.rule}`,
                  fontFamily: W.mono, fontSize: 8, letterSpacing: 0.5,
                }}>{it.cat.toUpperCase()}</div>
                <div style={{
                  position: 'absolute', bottom: 6, right: 6,
                  width: 22, height: 22, borderRadius: 999,
                  background: W.paper, border: `1px solid ${W.rule}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10,
                }}>{it.state}</div>
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontFamily: W.mono, fontSize: 10, color: W.inkSoft, letterSpacing: 0.5,
                }}>foto</div>
              </div>
              <div style={{ padding: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.1 }}>{it.name}</div>
                <div style={{
                  marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div style={{
                    fontFamily: W.mono, fontSize: 11, fontWeight: 700, color: it.tone,
                  }}>{it.days}</div>
                  <div style={{
                    width: 28, height: 4, borderRadius: 2, background: W.paperAlt, position: 'relative', overflow: 'hidden',
                  }}>
                    <div style={{
                      position: 'absolute', left: 0, top: 0, bottom: 0,
                      width: it.days === 'Hoy' ? '95%' : it.days === '2 d' ? '70%' : it.days === '4 d' ? '50%' : it.days === '30 d' ? '10%' : '30%',
                      background: it.tone,
                    }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <WTabBar active={1} />
    </WScreen>
  );
}

Object.assign(window, { DespensaA, DespensaB });
