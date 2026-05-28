// screens-alertas.jsx — 2 variations of Alertas

// ─────────────────────────────────────────────────────────────
// V1: Feed conversacional, agrupado por día, tono empático
// ─────────────────────────────────────────────────────────────
function AlertasA() {
  return (
    <WScreen>
      {/* header */}
      <div style={{ padding: '4px 18px 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.4 }}>Alertas</div>
          <div style={{
            width: 32, height: 32, borderRadius: 999, border: `1px solid ${W.rule}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
          }}>⚙</div>
        </div>
        <div style={{ fontSize: 13, color: W.inkSoft }}>
          3 cosas que mirar hoy · todas con tiempo de sobra
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 18px 100px' }}>
        {/* day group */}
        <div style={{
          fontFamily: W.mono, fontSize: 10, letterSpacing: 1.5, color: W.inkMute,
          textTransform: 'uppercase', padding: '6px 0 10px',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span>Hoy</span>
          <div style={{ flex: 1, height: 1, background: W.inkMute, opacity: 0.3 }} />
          <span>14 may</span>
        </div>

        {/* conversational bubbles */}
        {[
          {
            tone: W.red, time: '08:30',
            msg: 'Tu yogur natural vence hoy. Si lo abrís ahora, todavía está en buen estado.',
            actions: ['Ver opciones', 'Lo usé', 'Posponer'],
            product: 'Yogur natural · 1 kg',
          },
          {
            tone: W.amber, time: '09:00',
            msg: 'La lechuga que compraste el 9 va a estar mejor en los próximos 2 días.',
            actions: ['Ver recetas', 'Marcar usado'],
            product: 'Lechuga mantecosa',
          },
        ].map((a, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            {/* timestamp + chip */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, paddingLeft: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: 999, background: a.tone }} />
              <div style={{ fontFamily: W.mono, fontSize: 10, color: W.inkMute, letterSpacing: 0.8 }}>{a.time} · {a.product}</div>
            </div>
            {/* bubble */}
            <div style={{
              border: `1.25px solid ${W.rule}`, borderRadius: 16,
              borderTopLeftRadius: 4,
              background: W.paper, padding: '12px 14px',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
                background: a.tone, borderRadius: '3px 0 0 16px',
              }} />
              <div style={{ fontSize: 14, lineHeight: 1.4, color: W.ink }}>
                {a.msg}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                {a.actions.map((act, j) => (
                  <div key={j} style={{
                    padding: '5px 10px', borderRadius: 8,
                    border: `1px solid ${W.rule}`,
                    background: j === 0 ? W.greenSoft : W.paper,
                    fontSize: 11, fontWeight: 600,
                    color: j === 0 ? W.green : W.ink,
                  }}>{act}</div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* day group: tomorrow */}
        <div style={{
          fontFamily: W.mono, fontSize: 10, letterSpacing: 1.5, color: W.inkMute,
          textTransform: 'uppercase', padding: '10px 0 10px',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span>Mañana</span>
          <div style={{ flex: 1, height: 1, background: W.inkMute, opacity: 0.3 }} />
          <span>15 may</span>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, paddingLeft: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: 999, background: W.amber }} />
            <div style={{ fontFamily: W.mono, fontSize: 10, color: W.inkMute, letterSpacing: 0.8 }}>08:00 · Queso cremoso</div>
          </div>
          <div style={{
            border: `1.25px solid ${W.rule}`, borderRadius: 16, borderTopLeftRadius: 4,
            background: W.paper, padding: '12px 14px', position: 'relative',
          }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: W.amber, borderRadius: '3px 0 0 16px' }} />
            <div style={{ fontSize: 14, lineHeight: 1.4 }}>
              Te avisaremos cuando tu queso cremoso esté próximo a vencer.
            </div>
            <div style={{ marginTop: 8 }}>
              <WChip>● Programada</WChip>
            </div>
          </div>
        </div>

        {/* assistant footer */}
        <div style={{
          marginTop: 10, padding: 14, borderRadius: 14,
          background: W.greenSoft, border: `1.25px dashed ${W.green}`,
        }}>
          <div style={{ fontFamily: W.hand, fontSize: 19, color: W.green, lineHeight: 1.2 }}>
            Vas bien — esta semana tirás menos que la pasada.
          </div>
          <div style={{ fontSize: 11, color: W.inkSoft, marginTop: 6 }}>
            Ver detalle en el reporte mensual →
          </div>
        </div>
      </div>

      <WTabBar active={3} />
    </WScreen>
  );
}

// ─────────────────────────────────────────────────────────────
// V2: Bandas de urgencia (Hoy / Esta semana / Próximamente)
// ─────────────────────────────────────────────────────────────
function AlertasB() {
  const bands = [
    {
      title: 'Hoy', subtitle: 'Necesitan tu atención',
      tone: W.red, bg: W.redSoft, count: 1,
      items: [
        { name: 'Yogur natural', meta: 'Lácteos · abierto', sub: 'Vence al final del día' },
      ],
    },
    {
      title: 'Esta semana', subtitle: 'Próximos 7 días',
      tone: W.amber, bg: W.amberSoft, count: 3,
      items: [
        { name: 'Lechuga mantecosa', meta: '2 días · cerrado', sub: '' },
        { name: 'Queso cremoso', meta: '4 días · abierto', sub: '' },
        { name: 'Pan lactal', meta: '5 días · cerrado', sub: '' },
      ],
    },
    {
      title: 'Más adelante', subtitle: 'En las próximas semanas',
      tone: W.green, bg: W.greenSoft, count: 4,
      items: [],
    },
  ];
  return (
    <WScreen>
      {/* header */}
      <div style={{ padding: '4px 18px 8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.4 }}>Alertas</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <WChip>Todos</WChip>
            <div style={{ width: 32, height: 32, borderRadius: 999, border: `1px solid ${W.rule}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>⚙</div>
          </div>
        </div>

        {/* summary strip */}
        <WCard padding={12} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, border: `1px solid ${W.rule}`,
              background: W.greenSoft,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: W.mono, fontSize: 18, fontWeight: 700, color: W.green,
            }}>8</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>8 alertas activas</div>
              <div style={{ fontSize: 11, color: W.inkSoft, marginTop: 1 }}>
                1 urgente · 3 esta semana · 4 más adelante
              </div>
            </div>
            <div style={{ fontSize: 11, color: W.green, fontWeight: 600 }}>Silenciar 1h</div>
          </div>
        </WCard>
      </div>

      {/* bands */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 18px 100px' }}>
        {bands.map((b, bi) => (
          <div key={bi} style={{ marginBottom: 14 }}>
            {/* band header */}
            <div style={{
              border: `1.25px solid ${W.rule}`, borderRadius: 14,
              background: b.bg, padding: '10px 14px',
              display: 'flex', alignItems: 'center', gap: 10,
              borderBottomLeftRadius: b.items.length ? 0 : 14,
              borderBottomRightRadius: b.items.length ? 0 : 14,
              borderBottom: b.items.length ? 'none' : `1.25px solid ${W.rule}`,
              position: 'relative',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 999,
                background: b.tone, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: W.mono, fontSize: 12, fontWeight: 700,
              }}>{b.count}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{b.title}</div>
                <div style={{ fontSize: 11, color: W.inkSoft, marginTop: 1 }}>{b.subtitle}</div>
              </div>
              <div style={{ fontSize: 18, color: W.ink, opacity: 0.6 }}>{b.items.length ? '⌃' : '⌄'}</div>
            </div>

            {/* items inside band */}
            {b.items.length > 0 && (
              <div style={{
                border: `1.25px solid ${W.rule}`, borderTop: 'none',
                borderRadius: '0 0 14px 14px', background: W.paper, padding: '0 14px',
              }}>
                {b.items.map((it, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '12px 0',
                    borderBottom: i < b.items.length - 1 ? `1px dashed ${W.inkMute}` : 'none',
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      border: `1px solid ${W.rule}`, background: b.bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: W.mono, fontSize: 9, color: W.inkSoft,
                    }}>img</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{it.name}</div>
                      <div style={{ fontSize: 11, color: W.inkSoft, marginTop: 1 }}>{it.meta}</div>
                    </div>
                    {/* swipe-action shortcuts */}
                    <div style={{ display: 'flex', gap: 4 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: 999,
                        border: `1px solid ${W.rule}`, background: W.greenSoft,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, color: W.green, fontWeight: 700,
                      }}>✓</div>
                      <div style={{
                        width: 30, height: 30, borderRadius: 999,
                        border: `1px solid ${W.rule}`, background: W.paper,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, color: W.inkSoft,
                      }}>⌖</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* tip */}
        <div style={{
          marginTop: 8, padding: 14, borderRadius: 14,
          border: `1.25px dashed ${W.inkMute}`, background: W.paper,
        }}>
          <div style={{ fontFamily: W.mono, fontSize: 9, letterSpacing: 1.2, color: W.inkMute, textTransform: 'uppercase', marginBottom: 6 }}>Sugerencia</div>
          <div style={{ fontSize: 13, lineHeight: 1.4 }}>
            Podés ajustar cuándo recibís las alertas en <span style={{ fontWeight: 600 }}>Configuración → Notificaciones</span>.
          </div>
        </div>
      </div>

      <WTabBar active={3} />
    </WScreen>
  );
}

Object.assign(window, { AlertasA, AlertasB });
