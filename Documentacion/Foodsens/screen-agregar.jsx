// screen-agregar.jsx — Add product manually

function AgregarManual() {
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
        <button style={iconBtn}><Icon name="x" size={20}/></button>
        <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: -0.2 }}>Agregar producto</div>
        <button style={iconBtn}><Icon name="scan" size={18}/></button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', paddingTop: 110, paddingBottom: 100 }}>
        {/* prompt + helper */}
        <div style={{ padding: '0 22px 18px' }}>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.4, lineHeight: 1.2 }}>
            Contanos qué guardás
          </div>
          <div style={{ fontSize: 13.5, color: T.inkSoft, marginTop: 6, lineHeight: 1.45 }}>
            Lo de siempre alcanza — nombre y fecha. El resto lo sugerimos nosotros.
          </div>
        </div>

        {/* name field */}
        <Section label="Nombre del producto">
          <InputField placeholder="Ej: Yogur natural" value="Yogur natural Ilolay" focused/>
        </Section>

        {/* category picker */}
        <Section label="Categoría" hint="Tocá para elegir otra">
          <div style={{
            display: 'flex', gap: 8, overflowX: 'auto', padding: '0 18px 4px', margin: '0 -18px',
          }}>
            {Object.entries(CATEGORIES).slice(0, 6).map(([key, c]) => {
              const selected = key === 'lacteos';
              return (
                <button key={key} style={{
                  flexShrink: 0, padding: '10px 14px',
                  borderRadius: T.rMd,
                  background: selected ? c.tint : T.surface,
                  border: `1.5px solid ${selected ? c.stroke : T.border}`,
                  display: 'flex', alignItems: 'center', gap: 8,
                  color: T.ink, cursor: 'pointer',
                }}>
                  <div style={{ color: c.stroke }}>
                    <Icon name={c.icon} size={18} strokeWidth={1.75}/>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: selected ? 700 : 600 }}>{c.label}</span>
                </button>
              );
            })}
          </div>
        </Section>

        {/* state */}
        <Section label="Estado">
          <div style={{
            display: 'flex', padding: 4, background: T.surfaceAlt, borderRadius: T.rMd,
            border: `1px solid ${T.border}`,
          }}>
            {[
              { id: 'cerrado',   label: 'Cerrado',   icon: 'closed' },
              { id: 'abierto',   label: 'Abierto',   icon: 'open',     active: true },
              { id: 'congelado', label: 'Congelado', icon: 'snow' },
            ].map((s) => (
              <button key={s.id} style={{
                flex: 1, padding: '10px 4px', borderRadius: 10,
                background: s.active ? T.surface : 'transparent',
                border: s.active ? `1px solid ${T.border}` : 'none',
                boxShadow: s.active ? T.shadowSm : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                color: s.active ? T.ink : T.inkSoft, cursor: 'pointer',
                fontSize: 13, fontWeight: s.active ? 700 : 500,
              }}>
                <Icon name={s.icon} size={14} strokeWidth={2}/>
                {s.label}
              </button>
            ))}
          </div>
        </Section>

        {/* date — quick presets + calendar */}
        <Section label="Fecha de vencimiento" hint="Sugerencia: 7 días desde hoy">
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            {[
              { l: 'Hoy',      d: 0 },
              { l: '3 días',   d: 3 },
              { l: '1 sem',    d: 7, active: true },
              { l: '2 sem',    d: 14 },
              { l: '1 mes',    d: 30 },
            ].map((p, i) => (
              <button key={i} style={{
                flex: 1, padding: '10px 4px', borderRadius: T.rMd,
                background: p.active ? T.green : T.surface,
                border: `1.5px solid ${p.active ? T.green : T.border}`,
                color: p.active ? '#fff' : T.ink,
                fontSize: 12.5, fontWeight: p.active ? 700 : 600, cursor: 'pointer',
              }}>{p.l}</button>
            ))}
          </div>
          <div style={{
            padding: '14px 16px', borderRadius: T.rMd,
            background: T.surface, border: `1px solid ${T.border}`,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <Icon name="calendar" size={20} color={T.inkSoft}/>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: T.fontMono, fontSize: 10, color: T.inkMute,
                letterSpacing: 1.3, fontWeight: 600, textTransform: 'uppercase',
              }}>Vence</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}>
                Jueves 21 de mayo
              </div>
            </div>
            <DaysPill days={7}/>
          </div>
        </Section>

        {/* quantity */}
        <Section label="Cantidad" hint="Opcional">
          <div style={{
            padding: '6px 8px', borderRadius: T.rMd,
            background: T.surface, border: `1px solid ${T.border}`,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <button style={qtyBtn}><Icon name="minus" size={16} strokeWidth={2.5}/></button>
            <div style={{ flex: 1, textAlign: 'center', fontSize: 17, fontWeight: 700, letterSpacing: -0.3 }}>
              1 <span style={{ fontSize: 14, color: T.inkSoft, fontWeight: 500 }}>kg</span>
            </div>
            <button style={qtyBtn}><Icon name="plus" size={16} strokeWidth={2.5}/></button>
          </div>
        </Section>

        {/* photo upload */}
        <Section label="Foto" hint="Opcional">
          <button style={{
            width: '100%', padding: '14px 16px', borderRadius: T.rMd,
            background: T.surface, border: `1.5px dashed ${T.border}`,
            display: 'flex', alignItems: 'center', gap: 12,
            color: T.inkSoft, cursor: 'pointer', textAlign: 'left',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: T.rMd,
              background: T.surfaceAlt, color: T.inkSoft,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="plus" size={18}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: T.ink }}>Sumar foto</div>
              <div style={{ fontSize: 12, color: T.inkMute, marginTop: 2 }}>Para reconocerlo a simple vista</div>
            </div>
          </button>
        </Section>
      </div>

      {/* sticky save */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: T.surface, borderTop: `1px solid ${T.border}`,
        padding: '12px 18px 30px', display: 'flex', gap: 8,
        boxShadow: T.shadowLg,
      }}>
        <Button variant="primary" size="lg" full leading={<Icon name="check" size={18} strokeWidth={2.5}/>}>
          Agregar a despensa
        </Button>
      </div>
    </div>
  );
}

function Section({ label, hint, children }) {
  return (
    <div style={{ padding: '0 18px 20px' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8,
      }}>
        <div style={{
          fontFamily: T.fontMono, fontSize: 10.5, color: T.inkSoft,
          letterSpacing: 1.3, textTransform: 'uppercase', fontWeight: 600,
        }}>{label}</div>
        {hint && <div style={{ fontSize: 11.5, color: T.inkMute }}>{hint}</div>}
      </div>
      {children}
    </div>
  );
}

function InputField({ placeholder, value, focused }) {
  return (
    <div style={{
      height: 52, padding: '0 16px', borderRadius: T.rMd,
      background: T.surface,
      border: `1.5px solid ${focused ? T.green : T.border}`,
      boxShadow: focused ? `0 0 0 4px ${T.greenWash}` : 'none',
      display: 'flex', alignItems: 'center', gap: 8,
      fontSize: 15, fontWeight: 600, color: value ? T.ink : T.inkMute,
    }}>
      {value || placeholder}
      {focused && (
        <div style={{
          width: 2, height: 20, background: T.green,
          animation: 'caret 1s steps(1) infinite',
        }}/>
      )}
    </div>
  );
}

const qtyBtn = {
  width: 36, height: 36, borderRadius: T.rMd,
  background: T.surfaceAlt, border: `1px solid ${T.border}`,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: T.ink, cursor: 'pointer',
};

Object.assign(window, { AgregarManual });
