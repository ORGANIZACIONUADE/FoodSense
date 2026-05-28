// screens-detalle.jsx — 2 variations of Detalle de producto

// ─────────────────────────────────────────────────────────────
// V1: Vertical card con timeline de vencimiento
// ─────────────────────────────────────────────────────────────
function DetalleA() {
  return (
    <WScreen>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90 }}>
        {/* top bar */}
        <div style={{
          padding: '4px 14px 8px', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 999, border: `1px solid ${W.rule}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
          }}>←</div>
          <div style={{ fontFamily: W.mono, fontSize: 10, letterSpacing: 1.2, color: W.inkMute, textTransform: 'uppercase' }}>Detalle</div>
          <div style={{
            width: 36, height: 36, borderRadius: 999, border: `1px solid ${W.rule}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
          }}>⋯</div>
        </div>

        {/* hero image */}
        <div style={{ padding: '8px 18px 0' }}>
          <WPlaceholder label="foto del producto" h={180} radius={16} />
        </div>

        {/* product info */}
        <div style={{ padding: '14px 18px 0' }}>
          <WChip color={W.inkSoft}>LÁCTEOS</WChip>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.4, marginTop: 8, lineHeight: 1.1 }}>
            Yogur natural Ilolay
          </div>
          <div style={{ fontSize: 13, color: W.inkSoft, marginTop: 4 }}>1 kg · agregado el 8 may</div>
        </div>

        {/* big countdown */}
        <div style={{ padding: '14px 18px 0' }}>
          <WCard padding={16} accent={W.red}>
            <div style={{ fontFamily: W.mono, fontSize: 10, letterSpacing: 1.5, color: W.red, textTransform: 'uppercase' }}>Vence</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 2 }}>
              <div style={{ fontSize: 42, fontWeight: 700, color: W.red, lineHeight: 1, letterSpacing: -1 }}>HOY</div>
              <div style={{ fontSize: 13, color: W.inkSoft }}>14 mayo</div>
            </div>
            <div style={{ fontSize: 12, color: W.inkSoft, marginTop: 6 }}>
              Te sugerimos usarlo en las próximas 24h.
            </div>
          </WCard>
        </div>

        {/* timeline */}
        <div style={{ padding: '14px 18px 0' }}>
          <WHeading kicker="Línea de tiempo" style={{ marginBottom: 10 }}>Historia del producto</WHeading>
          <div style={{ paddingLeft: 6 }}>
            {[
              { label: 'Comprado', date: '8 may', done: true },
              { label: 'Abierto', date: '11 may', done: true },
              { label: 'Vence', date: '14 may', done: false, current: true },
              { label: 'Tirar (recomendado)', date: '16 may', done: false, dim: true },
            ].map((step, i, arr) => (
              <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: i < arr.length - 1 ? 12 : 0, position: 'relative' }}>
                <div style={{
                  width: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0,
                }}>
                  <div style={{
                    width: 12, height: 12, borderRadius: 999,
                    background: step.current ? W.red : step.done ? W.green : W.paper,
                    border: `1.5px solid ${step.current ? W.red : step.done ? W.green : W.inkMute}`,
                    marginTop: 2,
                  }} />
                  {i < arr.length - 1 && (
                    <div style={{ flex: 1, width: 1.5, background: step.done ? W.green : W.inkMute, marginTop: 2 }} />
                  )}
                </div>
                <div style={{ flex: 1, paddingBottom: 2 }}>
                  <div style={{ fontSize: 13, fontWeight: step.current ? 700 : 500, color: step.dim ? W.inkMute : W.ink }}>{step.label}</div>
                  <div style={{ fontFamily: W.mono, fontSize: 10, color: W.inkMute, marginTop: 1 }}>{step.date}</div>
                </div>
                {step.current && (
                  <WNote color={W.red} style={{ alignSelf: 'center' }}>← estás acá</WNote>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* metadata */}
        <div style={{ padding: '18px 18px 0' }}>
          <WCard padding={0}>
            {[
              ['Estado', 'Abierto'],
              ['Cantidad', '750 g restantes'],
              ['Categoría', 'Lácteos'],
              ['Ubicación', 'Heladera'],
            ].map(([k, v], i, arr) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', padding: '10px 14px',
                borderBottom: i < arr.length - 1 ? `1px dashed ${W.inkMute}` : 'none',
                fontSize: 13,
              }}>
                <span style={{ color: W.inkSoft }}>{k}</span>
                <span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </WCard>
        </div>
      </div>

      {/* sticky action bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: W.paper, borderTop: `1px solid ${W.rule}`,
        padding: '12px 18px 28px', display: 'flex', gap: 8,
      }}>
        <div style={{
          flex: 1, padding: '12px 0', borderRadius: 12,
          border: `1px solid ${W.rule}`, background: W.paperAlt,
          textAlign: 'center', fontSize: 13, fontWeight: 600,
        }}>Tirar</div>
        <div style={{
          flex: 2, padding: '12px 0', borderRadius: 12,
          background: W.green, color: '#fff',
          textAlign: 'center', fontSize: 13, fontWeight: 600,
          border: `1px solid ${W.rule}`,
        }}>Marcar como usado</div>
      </div>
    </WScreen>
  );
}

// ─────────────────────────────────────────────────────────────
// V2: Status-forward con segmented + sugerencia de receta
// ─────────────────────────────────────────────────────────────
function DetalleB() {
  return (
    <WScreen>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 100 }}>
        {/* hero color band */}
        <div style={{
          background: W.amberSoft, padding: '8px 18px 24px',
          borderBottom: `1.25px solid ${W.rule}`,
          position: 'relative',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 999, border: `1px solid ${W.rule}`, background: W.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>←</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 999, border: `1px solid ${W.rule}`, background: W.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>♡</div>
              <div style={{ width: 36, height: 36, borderRadius: 999, border: `1px solid ${W.rule}`, background: W.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>✎</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <WPlaceholder label="foto" h={92} w={92} radius={14} style={{ background: W.paper, flexShrink: 0 }}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <WChip bg={W.paper}>Lácteos</WChip>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.3, marginTop: 6, lineHeight: 1.05 }}>
                Queso cremoso La Paulina
              </div>
              <div style={{ fontSize: 12, color: W.inkSoft, marginTop: 4 }}>290 g · escaneado el 10 may</div>
            </div>
          </div>
        </div>

        {/* countdown row */}
        <div style={{ padding: '16px 18px 0' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px 16px', borderRadius: 14,
            border: `1.25px solid ${W.rule}`,
            background: W.paper,
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 999, background: W.amberSoft,
              border: `1.5px solid ${W.amber}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: W.amber, lineHeight: 1 }}>4</div>
              <div style={{ fontFamily: W.mono, fontSize: 8, color: W.amber, marginTop: 1 }}>DÍAS</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Usalo antes del 18 mayo</div>
              <div style={{ fontSize: 12, color: W.inkSoft, marginTop: 2 }}>Una vez abierto, dura 3–5 días</div>
            </div>
          </div>
        </div>

        {/* state segmented */}
        <div style={{ padding: '18px 18px 0' }}>
          <div style={{ fontFamily: W.mono, fontSize: 10, letterSpacing: 1.5, color: W.inkMute, textTransform: 'uppercase', marginBottom: 8 }}>Estado actual</div>
          <div style={{
            border: `1.25px solid ${W.rule}`, borderRadius: 12, padding: 3,
            background: W.paperAlt, display: 'flex',
          }}>
            {[
              { l: 'Cerrado', i: '●' },
              { l: 'Abierto', i: '◐', active: true },
              { l: 'Congelado', i: '❄' },
            ].map((s, i) => (
              <div key={i} style={{
                flex: 1, padding: '8px 4px', borderRadius: 9,
                background: s.active ? W.amber : 'transparent',
                color: s.active ? '#fff' : W.ink,
                border: s.active ? `1px solid ${W.rule}` : 'none',
                fontSize: 12, fontWeight: 600, textAlign: 'center',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              }}>
                <span>{s.i}</span>{s.l}
              </div>
            ))}
          </div>
          <WNote arrow style={{ marginTop: 6, marginLeft: 6 }}>tap para cambiar estado</WNote>
        </div>

        {/* recipe suggestion */}
        <div style={{ padding: '18px 18px 0' }}>
          <WHeading kicker="Aprovechalo" style={{ marginBottom: 10 }}>Ideas con esto</WHeading>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4, marginLeft: -18, paddingLeft: 18 }}>
            {[
              { name: 'Tarta de queso y verduras', time: '40 min', uses: '+2 ítems' },
              { name: 'Provoleta criolla', time: '15 min', uses: '+1 ítem' },
              { name: 'Sándwich caliente', time: '8 min', uses: '+1 ítem' },
            ].map((r, i) => (
              <div key={i} style={{
                width: 150, flexShrink: 0, border: `1.25px solid ${W.rule}`, borderRadius: 12,
                background: W.paper, padding: 10,
              }}>
                <WPlaceholder label="img" h={70} radius={8} />
                <div style={{ fontSize: 12, fontWeight: 600, marginTop: 8, lineHeight: 1.2 }}>{r.name}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontFamily: W.mono, fontSize: 9, color: W.inkSoft }}>
                  <span>{r.time}</span><span style={{ color: W.green }}>{r.uses}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* details */}
        <div style={{ padding: '18px 18px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <WCard padding={12}>
              <div style={{ fontFamily: W.mono, fontSize: 9, color: W.inkMute, letterSpacing: 1.2, textTransform: 'uppercase' }}>Comprado</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>10 may</div>
            </WCard>
            <WCard padding={12}>
              <div style={{ fontFamily: W.mono, fontSize: 9, color: W.inkMute, letterSpacing: 1.2, textTransform: 'uppercase' }}>Abierto</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>13 may</div>
            </WCard>
            <WCard padding={12}>
              <div style={{ fontFamily: W.mono, fontSize: 9, color: W.inkMute, letterSpacing: 1.2, textTransform: 'uppercase' }}>Cantidad</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>~60% restante</div>
            </WCard>
            <WCard padding={12}>
              <div style={{ fontFamily: W.mono, fontSize: 9, color: W.inkMute, letterSpacing: 1.2, textTransform: 'uppercase' }}>Código</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>7790580…</div>
            </WCard>
          </div>
        </div>
      </div>

      {/* sticky action bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: W.paper, borderTop: `1px solid ${W.rule}`,
        padding: '12px 18px 28px', display: 'flex', gap: 8,
      }}>
        <div style={{
          flex: 1, padding: '12px 0', borderRadius: 12,
          border: `1px solid ${W.rule}`, background: W.paperAlt,
          textAlign: 'center', fontSize: 13, fontWeight: 600,
        }}>Tirar</div>
        <div style={{
          flex: 2, padding: '12px 0', borderRadius: 12,
          background: W.green, color: '#fff',
          textAlign: 'center', fontSize: 13, fontWeight: 600,
          border: `1px solid ${W.rule}`,
        }}>Marcar como usado</div>
      </div>
    </WScreen>
  );
}

Object.assign(window, { DetalleA, DetalleB });
