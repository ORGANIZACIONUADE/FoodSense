// screen-escaneo.jsx — Camera viewfinder with detected product sheet

function Escaneo() {
  return (
    <div style={{
      width: '100%', height: '100%', background: '#0E1311',
      fontFamily: T.font, color: '#fff',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* camera "feed" — gradient suggesting kitchen counter */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(ellipse at 50% 30%, #2a3b34 0%, #161e1b 60%, #0a0e0c 100%),
          linear-gradient(180deg, #1a2521 0%, #0E1311 100%)
        `,
      }}/>

      {/* mock product silhouette */}
      <div style={{
        position: 'absolute', left: '50%', top: '42%', transform: 'translate(-50%, -50%)',
        width: 120, height: 170, borderRadius: 12,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div style={{
          position: 'absolute', left: 16, right: 16, top: 80,
          height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.3)',
        }}/>
      </div>

      {/* top bar */}
      <div style={{
        position: 'absolute', top: 56, left: 16, right: 16, zIndex: 5,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <button style={{
          width: 40, height: 40, borderRadius: T.rFull,
          background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', cursor: 'pointer',
        }}>
          <Icon name="x" size={20}/>
        </button>
        <div style={{
          padding: '8px 14px', borderRadius: T.rFull,
          background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.15)',
          fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: 999, background: T.green }}/>
          Escaneando
        </div>
        <button style={{
          width: 40, height: 40, borderRadius: T.rFull,
          background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', cursor: 'pointer',
        }}>
          <Icon name="flash" size={18}/>
        </button>
      </div>

      {/* scan frame */}
      <div style={{
        position: 'absolute', left: '50%', top: '40%', transform: 'translate(-50%, -50%)',
        width: 240, height: 160, pointerEvents: 'none',
      }}>
        {[
          { top: 0, left: 0,    bt: 't', bl: 'l' },
          { top: 0, right: 0,   bt: 't', br: 'r' },
          { bottom: 0, left: 0, bb: 'b', bl: 'l' },
          { bottom: 0, right: 0,bb: 'b', br: 'r' },
        ].map((c, i) => (
          <div key={i} style={{
            position: 'absolute', ...c, width: 28, height: 28,
            borderTop: c.bt ? `3px solid ${T.green}` : 'none',
            borderBottom: c.bb ? `3px solid ${T.green}` : 'none',
            borderLeft: c.bl ? `3px solid ${T.green}` : 'none',
            borderRight: c.br ? `3px solid ${T.green}` : 'none',
            borderRadius: i === 0 ? '8px 0 0 0' : i === 1 ? '0 8px 0 0' : i === 2 ? '0 0 0 8px' : '0 0 8px 0',
          }}/>
        ))}
        {/* scan line */}
        <div style={{
          position: 'absolute', top: '50%', left: 8, right: 8, height: 2,
          background: T.green, boxShadow: `0 0 16px ${T.green}`,
        }}/>
      </div>

      {/* helper text */}
      <div style={{
        position: 'absolute', left: 24, right: 24, top: '60%',
        textAlign: 'center', color: 'rgba(255,255,255,0.85)',
      }}>
        <div style={{ fontSize: 15, fontWeight: 600 }}>Apuntá al código de barras</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>
          Lo reconocemos al instante
        </div>
      </div>

      {/* bottom sheet — detected product */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: T.surface, color: T.ink,
        borderRadius: '24px 24px 0 0', padding: '12px 20px 28px',
        boxShadow: T.shadowFloat,
      }}>
        {/* handle */}
        <div style={{
          width: 40, height: 4, borderRadius: 2, background: T.border,
          margin: '0 auto 14px',
        }}/>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{
            width: 22, height: 22, borderRadius: T.rFull, background: T.greenSoft,
            color: T.green, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="check" size={14} strokeWidth={2.5}/>
          </div>
          <span style={{
            fontFamily: T.fontMono, fontSize: 11, color: T.greenDeep,
            fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase',
          }}>
            Producto reconocido
          </span>
        </div>

        <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 16 }}>
          <CategoryIcon category="lacteos" size={56}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: -0.3, lineHeight: 1.15 }}>
              Yogur natural Ilolay
            </div>
            <div style={{ fontSize: 12.5, color: T.inkSoft, marginTop: 2 }}>
              1 kg · Lácteos
            </div>
          </div>
        </div>

        {/* editable fields preview */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16,
        }}>
          <FieldChip label="Vence" value="14 may" icon="calendar"/>
          <FieldChip label="Estado" value="Cerrado" icon="closed"/>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" size="md" style={{ flex: 1 }}>Editar</Button>
          <Button variant="primary"   size="md" style={{ flex: 2 }} leading={<Icon name="plus" size={18}/>}>
            Agregar a despensa
          </Button>
        </div>

        {/* manual entry link */}
        <div style={{
          textAlign: 'center', marginTop: 14,
          fontSize: 13, color: T.inkSoft,
        }}>
          ¿No tiene código? <span style={{ color: T.green, fontWeight: 600 }}>Cargá manual</span>
        </div>
      </div>
    </div>
  );
}

function FieldChip({ label, value, icon }) {
  return (
    <div style={{
      padding: '10px 12px', borderRadius: T.rMd,
      background: T.surfaceAlt, border: `1px solid ${T.border}`,
    }}>
      <div style={{
        fontFamily: T.fontMono, fontSize: 9.5, letterSpacing: 1.2,
        color: T.inkMute, textTransform: 'uppercase', fontWeight: 600,
      }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
        <Icon name={icon} size={14} color={T.inkSoft}/>
        <span style={{ fontSize: 14, fontWeight: 600, color: T.ink }}>{value}</span>
      </div>
    </div>
  );
}

Object.assign(window, { Escaneo });
