// screens-dashboard.jsx — 2 variations of the Dashboard

// ─────────────────────────────────────────────────────────────
// V1: Score-first. Big circular health gauge, ítems por vencer below.
// ─────────────────────────────────────────────────────────────
function DashboardA() {
  return (
    <WScreen>
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 18px 100px' }}>
        {/* Greeting */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <div style={{ fontFamily: W.mono, fontSize: 10, color: W.inkMute, letterSpacing: 1.5, textTransform: 'uppercase' }}>Jueves · 14 may</div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.4, marginTop: 2 }}>Hola, Mariana</div>
          </div>
          <div style={{
            width: 38, height: 38, borderRadius: 999,
            border: `1px solid ${W.rule}`, background: W.paperAlt,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: W.mono, fontSize: 11, color: W.inkSoft,
          }}>M</div>
        </div>

        {/* Health gauge */}
        <WCard style={{ padding: 18, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ position: 'relative', width: 110, height: 110, flexShrink: 0 }}>
              <svg width="110" height="110" viewBox="0 0 110 110">
                <circle cx="55" cy="55" r="48" fill="none" stroke={W.paperAlt} strokeWidth="8" />
                <circle cx="55" cy="55" r="48" fill="none" stroke={W.green} strokeWidth="8"
                  strokeDasharray={`${0.82 * 2 * Math.PI * 48} ${2 * Math.PI * 48}`}
                  strokeLinecap="round"
                  transform="rotate(-90 55 55)" />
              </svg>
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ fontSize: 28, fontWeight: 700, lineHeight: 1 }}>82</div>
                <div style={{ fontFamily: W.mono, fontSize: 9, color: W.inkMute, marginTop: 2, letterSpacing: 1 }}>SCORE</div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.2 }}>Tu heladera está saludable</div>
              <div style={{ fontSize: 12, color: W.inkSoft, marginTop: 4, lineHeight: 1.4 }}>
                Aprovechaste el 89% de tus compras este mes.
              </div>
              <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
                <WChip color={W.green} bg={W.greenSoft}>+12 vs abril</WChip>
              </div>
            </div>
          </div>
        </WCard>

        {/* Quick stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 18 }}>
          {[
            { num: '3', label: 'A vencer hoy', color: W.red },
            { num: '7', label: 'Esta semana', color: W.amber },
            { num: '24', label: 'Total ítems', color: W.ink },
          ].map((s, i) => (
            <WCard key={i} padding={10} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontSize: 10, color: W.inkSoft, marginTop: 4 }}>{s.label}</div>
            </WCard>
          ))}
        </div>

        {/* Próximos a vencer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <WHeading kicker="Atención">Próximos a vencer</WHeading>
          <div style={{ fontSize: 11, color: W.green, fontWeight: 600 }}>Ver todo →</div>
        </div>
        <WCard padding={0} style={{ padding: '4px 14px' }}>
          <WProductRow name="Yogur natural" meta="Lácteos · abierto" days="Hoy" state={W.red} accent={W.redSoft}/>
          <WProductRow name="Lechuga mantecosa" meta="Verduras · cerrado" days="2 días" state={W.amber} accent={W.greenSoft}/>
          <WProductRow name="Queso cremoso" meta="Lácteos · abierto" days="4 días" state={W.amber} accent={W.amberSoft}/>
        </WCard>

        {/* Mini reporte */}
        <div style={{ marginTop: 18 }}>
          <WHeading kicker="Mayo" style={{ marginBottom: 8 }}>Cómo vas este mes</WHeading>
          <WCard padding={14}>
            <div style={{ display: 'flex', gap: 4, height: 56, alignItems: 'flex-end' }}>
              {[40, 60, 35, 70, 50, 80, 65, 55, 75, 90, 60, 70].map((h, i) => (
                <div key={i} style={{
                  flex: 1, height: `${h}%`,
                  background: i > 9 ? W.green : W.greenSoft,
                  borderRadius: 2, borderTop: `1px solid ${W.rule}`,
                }} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontFamily: W.mono, fontSize: 9, color: W.inkMute }}>
              <span>SEM 1</span><span>SEM 2</span><span>SEM 3</span><span>SEM 4</span>
            </div>
          </WCard>
        </div>
      </div>

      <WTabBar active={0} />
    </WScreen>
  );
}

// ─────────────────────────────────────────────────────────────
// V2: List-first / Today. Horizontal urgency carousel + weekly view.
// ─────────────────────────────────────────────────────────────
function DashboardB() {
  return (
    <WScreen>
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 0 100px' }}>
        {/* Header */}
        <div style={{ padding: '0 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 13, color: W.inkSoft }}>En tu heladera hay</div>
            <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: -0.8, lineHeight: 1 }}>
              24 <span style={{ fontSize: 18, fontWeight: 500, color: W.inkSoft }}>ítems</span>
            </div>
          </div>
          <WChip color={W.green} bg={W.greenSoft} solid={false} style={{ fontSize: 12 }}>
            ● en orden
          </WChip>
        </div>

        {/* Urgency carousel */}
        <div style={{ paddingLeft: 18, marginBottom: 18 }}>
          <div style={{
            fontFamily: W.mono, fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase',
            color: W.inkMute, marginBottom: 8,
          }}>Atención inmediata</div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingRight: 18, paddingBottom: 6 }}>
            {[
              { name: 'Yogur natural', days: 'Vence HOY', sub: 'Lácteos · abierto', tone: W.red, bg: W.redSoft },
              { name: 'Lechuga', days: 'Vence en 2d', sub: 'Verduras', tone: W.amber, bg: W.amberSoft },
              { name: 'Queso cremoso', days: 'Vence en 4d', sub: 'Lácteos · abierto', tone: W.amber, bg: W.amberSoft },
              { name: 'Pollo', days: 'Vence en 5d', sub: 'Carnes · congelado', tone: W.green, bg: W.greenSoft },
            ].map((it, i) => (
              <WCard key={i} padding={12} style={{ width: 138, flexShrink: 0 }}>
                <div style={{
                  width: '100%', aspectRatio: '1 / 1', borderRadius: 10,
                  border: `1px dashed ${W.inkMute}`, background: it.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: W.mono, fontSize: 10, color: W.inkSoft, marginBottom: 8,
                }}>foto</div>
                <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.15 }}>{it.name}</div>
                <div style={{ fontSize: 10, color: W.inkSoft, marginTop: 2 }}>{it.sub}</div>
                <div style={{
                  marginTop: 8, padding: '4px 8px', borderRadius: 6,
                  background: it.tone, color: '#fff',
                  fontFamily: W.mono, fontSize: 10, fontWeight: 600,
                  textAlign: 'center', letterSpacing: 0.3,
                }}>{it.days}</div>
              </WCard>
            ))}
          </div>
        </div>

        {/* Esta semana — schedule */}
        <div style={{ padding: '0 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
            <WHeading kicker="Esta semana">Tu agenda alimentaria</WHeading>
          </div>
          <WCard padding={0}>
            {[
              { d: 'JUE', dn: '14', label: 'Yogur natural · 1 ítem', tone: W.red, today: true },
              { d: 'VIE', dn: '15', label: '—', tone: null },
              { d: 'SÁB', dn: '16', label: 'Lechuga · 1 ítem', tone: W.amber },
              { d: 'DOM', dn: '17', label: '—', tone: null },
              { d: 'LUN', dn: '18', label: 'Queso cremoso · 1 ítem', tone: W.amber },
            ].map((row, i, arr) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px',
                borderBottom: i < arr.length - 1 ? `1px dashed ${W.inkMute}` : 'none',
              }}>
                <div style={{
                  width: 36, textAlign: 'center',
                  padding: '3px 0', borderRadius: 8,
                  border: row.today ? `1.5px solid ${W.green}` : `1px solid ${W.inkMute}`,
                  background: row.today ? W.greenSoft : 'transparent',
                }}>
                  <div style={{ fontFamily: W.mono, fontSize: 8, color: W.inkSoft }}>{row.d}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1 }}>{row.dn}</div>
                </div>
                <div style={{ flex: 1, fontSize: 13, color: row.tone ? W.ink : W.inkMute }}>{row.label}</div>
                {row.tone && <div style={{ width: 8, height: 8, borderRadius: 999, background: row.tone }} />}
              </div>
            ))}
          </WCard>
        </div>

        {/* Sugerencia */}
        <div style={{ padding: '14px 18px 0' }}>
          <WCard padding={14} accent={W.green}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <WPlaceholder label="receta" h={52} w={52} radius={10} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: W.mono, fontSize: 9, letterSpacing: 1.2, color: W.green, textTransform: 'uppercase' }}>Idea de hoy</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2, lineHeight: 1.25 }}>Tostones con yogur y palta</div>
                <div style={{ fontSize: 11, color: W.inkSoft, marginTop: 2 }}>Usa 3 ítems próximos a vencer</div>
              </div>
            </div>
          </WCard>
        </div>
      </div>

      <WTabBar active={0} />
    </WScreen>
  );
}

Object.assign(window, { DashboardA, DashboardB });
