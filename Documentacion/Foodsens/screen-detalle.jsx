// screen-detalle.jsx — Product detail (variant A: timeline)

function Detalle() {
  const timeline = [
    { label: 'Comprado',         date: '8 may',  done: true },
    { label: 'Abierto',          date: '11 may', done: true },
    { label: 'Vence',            date: '14 may', current: true },
    { label: 'Recomendado tirar',date: '16 may', dim: true },
  ];

  return (
    <div style={{
      width: '100%', height: '100%', background: T.bg,
      fontFamily: T.font, color: T.ink,
      position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* top bar */}
      <div style={{
        position: 'absolute', top: 56, left: 0, right: 0, zIndex: 5,
        padding: '6px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <button style={iconBtn}><Icon name="chevronLeft" size={20}/></button>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={iconBtn}><Icon name="heart" size={18}/></button>
          <button style={iconBtn}><Icon name="share" size={18}/></button>
        </div>
      </div>

      {/* scrollable content */}
      <div style={{ flex: 1, overflow: 'auto', paddingTop: 110, paddingBottom: 100 }}>
        {/* hero — big category icon */}
        <div style={{ padding: '0 24px 8px', display: 'flex', justifyContent: 'center' }}>
          <div style={{
            width: 168, height: 168, borderRadius: 32,
            background: CATEGORIES.lacteos.tint,
            color: CATEGORIES.lacteos.stroke,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `1px solid ${T.border}`,
          }}>
            <Icon name="dairy" size={92} strokeWidth={1.5}/>
          </div>
        </div>

        {/* product info */}
        <div style={{ padding: '20px 22px 0', textAlign: 'center' }}>
          <Chip tone="neutral" style={{ marginBottom: 10 }}>
            {CATEGORIES.lacteos.label}
          </Chip>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.5, lineHeight: 1.15 }}>
            Yogur natural Ilolay
          </div>
          <div style={{ fontSize: 13, color: T.inkSoft, marginTop: 4 }}>
            1 kg · agregado el 8 de mayo
          </div>
        </div>

        {/* countdown hero */}
        <div style={{ padding: '20px 18px 0' }}>
          <Card padding={18} style={{ background: T.redWash, border: `1px solid ${T.redSoft}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 64, height: 64, borderRadius: T.rFull,
                background: T.red, color: '#fff',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 4px 12px ${T.redSoft}`,
              }}>
                <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1 }}>0</div>
                <div style={{ fontFamily: T.fontMono, fontSize: 8.5, fontWeight: 600, letterSpacing: 0.8, marginTop: 1 }}>DÍAS</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: T.fontMono, fontSize: 10, color: T.redDeep,
                  letterSpacing: 1.3, textTransform: 'uppercase', fontWeight: 600,
                }}>Vence hoy</div>
                <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4, lineHeight: 1.25, color: T.ink }}>
                  Usalo en las próximas 24h
                </div>
                <div style={{ fontSize: 12.5, color: T.inkSoft, marginTop: 4, lineHeight: 1.4 }}>
                  Te sugerimos una receta abajo 🥑
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* timeline */}
        <div style={{ padding: '24px 18px 0' }}>
          <SectionHeading kicker="Línea de tiempo" style={{ padding: 0, marginBottom: 14 }}>
            Historia del producto
          </SectionHeading>
          <Card padding={18}>
            <div style={{ paddingLeft: 4 }}>
              {timeline.map((step, i, arr) => (
                <div key={i} style={{
                  display: 'flex', gap: 14,
                  paddingBottom: i < arr.length - 1 ? 14 : 0, position: 'relative',
                }}>
                  <div style={{
                    width: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0,
                  }}>
                    <div style={{
                      width: step.current ? 16 : 12,
                      height: step.current ? 16 : 12,
                      borderRadius: 999,
                      background: step.current ? T.red : step.done ? T.green : T.surface,
                      border: `2px solid ${step.current ? T.red : step.done ? T.green : T.border}`,
                      marginTop: 2, boxShadow: step.current ? `0 0 0 4px ${T.redWash}` : 'none',
                    }}/>
                    {i < arr.length - 1 && (
                      <div style={{
                        flex: 1, width: 2, marginTop: 2,
                        background: step.done ? T.green : T.border,
                      }}/>
                    )}
                  </div>
                  <div style={{ flex: 1, paddingBottom: 2 }}>
                    <div style={{
                      fontSize: 14, fontWeight: step.current ? 700 : 600,
                      color: step.dim ? T.inkMute : T.ink,
                      letterSpacing: -0.2,
                    }}>{step.label}</div>
                    <div style={{
                      fontFamily: T.fontMono, fontSize: 11, color: T.inkMute, marginTop: 2, fontWeight: 500,
                    }}>{step.date}</div>
                  </div>
                  {step.current && (
                    <Chip tone="red" solid leading={<Icon name="clock" size={11}/>}>
                      Hoy
                    </Chip>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* metadata */}
        <div style={{ padding: '20px 18px 0' }}>
          <SectionHeading style={{ padding: 0, marginBottom: 12 }}>Detalles</SectionHeading>
          <Card padding={0}>
            {[
              { k: 'Estado',     v: 'Abierto',         icon: 'open' },
              { k: 'Cantidad',   v: '~750 g restantes', icon: null  },
              { k: 'Ubicación',  v: 'Heladera',        icon: 'fridge' },
              { k: 'Código',     v: '7790580 123456',  icon: 'barcode' },
            ].map((row, i, arr) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 16px',
                borderBottom: i < arr.length - 1 ? `1px solid ${T.borderSoft}` : 'none',
              }}>
                <span style={{ fontSize: 13.5, color: T.inkSoft }}>{row.k}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {row.icon && <Icon name={row.icon} size={14} color={T.inkSoft}/>}
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{row.v}</span>
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* recipe suggestion */}
        <div style={{ padding: '20px 18px 0' }}>
          <SectionHeading kicker="Aprovechalo" style={{ padding: 0, marginBottom: 12 }}>
            Una idea para hoy
          </SectionHeading>
          <Card padding={0} style={{ overflow: 'hidden' }}>
            <div style={{
              height: 100,
              background: `linear-gradient(135deg, ${T.greenSoft} 0%, ${T.amberSoft} 100%)`,
              position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 12,
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: T.rFull, background: T.surface,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: CATEGORIES.lacteos.stroke,
                boxShadow: T.shadowMd,
              }}><Icon name="dairy" size={28}/></div>
              <div style={{ fontSize: 28 }}>+</div>
              <div style={{
                width: 56, height: 56, borderRadius: T.rFull, background: T.surface,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: CATEGORIES.frutas.stroke,
                boxShadow: T.shadowMd,
              }}><Icon name="fruit" size={28}/></div>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: -0.3 }}>
                Tostones con yogur y palta
              </div>
              <div style={{ fontSize: 12.5, color: T.inkSoft, marginTop: 4, lineHeight: 1.4 }}>
                Usa 3 ítems próximos a vencer · 15 minutos
              </div>
              <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <Chip tone="green">+2 productos aprovechados</Chip>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* sticky action bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: T.surface, borderTop: `1px solid ${T.border}`,
        padding: '12px 18px 30px', display: 'flex', gap: 8,
        boxShadow: T.shadowLg,
      }}>
        <Button variant="secondary" size="lg" style={{ flex: 1 }} leading={<Icon name="trash" size={18}/>}>
          Tirar
        </Button>
        <Button variant="primary" size="lg" style={{ flex: 2 }} leading={<Icon name="check" size={18} strokeWidth={2.5}/>}>
          Marcar como usado
        </Button>
      </div>
    </div>
  );
}

const iconBtn = {
  width: 40, height: 40, borderRadius: 9999,
  background: T.surface, border: `1px solid ${T.border}`,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: T.ink, cursor: 'pointer', boxShadow: T.shadowSm,
};

Object.assign(window, { Detalle });
