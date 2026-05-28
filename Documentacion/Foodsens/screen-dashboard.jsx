// screen-dashboard.jsx — Dashboard (variant A: score-first)

function Dashboard() {
  return (
    <Screen>
      {/* greeting */}
      <div style={{ padding: '4px 18px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 12.5, color: T.inkSoft, fontWeight: 500 }}>Jueves · 14 de mayo</div>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.5, marginTop: 2 }}>
            Hola, Mariana
          </div>
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: T.rFull,
          background: T.greenSoft, color: T.greenDeep,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 700, border: `1px solid ${T.border}`,
        }}>M</div>
      </div>

      {/* health gauge hero card */}
      <div style={{ padding: '0 18px' }}>
        <Card padding={20} elevated style={{ background: `linear-gradient(180deg, ${T.greenWash} 0%, ${T.surface} 65%)` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <Gauge value={82} size={108}/>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: T.fontMono, fontSize: 10, letterSpacing: 1.4,
                color: T.greenDeep, textTransform: 'uppercase', fontWeight: 600,
              }}>
                Salud de tu heladera
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.3, marginTop: 4, lineHeight: 1.15 }}>
                Vas muy bien este mes
              </div>
              <div style={{ fontSize: 12.5, color: T.inkSoft, marginTop: 6, lineHeight: 1.4 }}>
                Aprovechaste el 89% de lo que compraste.
              </div>
              <div style={{ marginTop: 10 }}>
                <Chip tone="green" leading={<Icon name="trending" size={12}/>}>
                  +12 vs abril
                </Chip>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* quick stats */}
      <div style={{ padding: '14px 18px 0', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {[
          { num: 3,  label: 'Vencen hoy',   tone: T.red,   icon: 'clock' },
          { num: 7,  label: 'Esta semana',  tone: T.amber, icon: 'calendar' },
          { num: 24, label: 'En despensa',  tone: T.green, icon: 'fridge' },
        ].map((s, i) => (
          <Card key={i} padding={12}>
            <div style={{ color: s.tone, marginBottom: 8 }}>
              <Icon name={s.icon} size={18} strokeWidth={2}/>
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.5, lineHeight: 1, color: T.ink }}>
              {s.num}
            </div>
            <div style={{ fontSize: 11, color: T.inkSoft, marginTop: 4, fontWeight: 500 }}>
              {s.label}
            </div>
          </Card>
        ))}
      </div>

      {/* sección próximos */}
      <div style={{ marginTop: 22 }}>
        <SectionHeading
          kicker="Próximos a vencer"
          trailing={<div style={{ fontSize: 12.5, color: T.green, fontWeight: 600 }}>Ver todo →</div>}
        >
          Mirá esto primero
        </SectionHeading>
        <div style={{ padding: '0 18px' }}>
          <Card padding={0} style={{ padding: '4px 16px' }}>
            <ProductRow name="Yogur natural Ilolay"  category="lacteos"  state="abierto"   days={0}/>
            <ProductRow name="Lechuga mantecosa"     category="verduras" state="cerrado"   days={2}/>
            <ProductRow name="Queso cremoso Paulina" category="lacteos"  state="abierto"   days={4} divider={false}/>
          </Card>
        </div>
      </div>

      {/* mini reporte */}
      <div style={{ marginTop: 22 }}>
        <SectionHeading kicker="Mayo">Cómo vas este mes</SectionHeading>
        <div style={{ padding: '0 18px' }}>
          <Card padding={16}>
            {/* bars */}
            <div style={{ display: 'flex', gap: 4, height: 64, alignItems: 'flex-end' }}>
              {[40, 60, 45, 70, 55, 80, 65, 50, 75, 90, 60, 70].map((h, i) => (
                <div key={i} style={{
                  flex: 1, height: `${h}%`,
                  background: i >= 9 ? T.green : T.greenSoft,
                  borderRadius: '4px 4px 2px 2px',
                }}/>
              ))}
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between', marginTop: 10,
              fontFamily: T.fontMono, fontSize: 10, color: T.inkMute, fontWeight: 500,
            }}>
              <span>sem 1</span><span>sem 2</span><span>sem 3</span><span style={{ color: T.green, fontWeight: 600 }}>esta sem</span>
            </div>
            <div style={{
              marginTop: 12, padding: '10px 12px', borderRadius: T.rMd,
              background: T.greenWash, fontSize: 12.5, color: T.greenDeep, lineHeight: 1.4,
            }}>
              Esta semana aprovechaste <b>3 productos más</b> que la pasada. Seguí así.
            </div>
          </Card>
        </div>
      </div>

      <TabBar active="home"/>
    </Screen>
  );
}

// ─── Gauge ───────────────────────────────────────────────────
function Gauge({ value = 80, size = 108 }) {
  const r = size / 2 - 8;
  const cx = size / 2, cy = size / 2;
  const C = 2 * Math.PI * r;
  const dash = (value / 100) * C;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={T.greenSoft} strokeWidth={8}/>
        <circle
          cx={cx} cy={cy} r={r}
          fill="none" stroke={T.green} strokeWidth={8}
          strokeDasharray={`${dash} ${C}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: -1, lineHeight: 1, color: T.ink }}>
          {value}
        </div>
        <div style={{
          fontFamily: T.fontMono, fontSize: 9, color: T.inkMute,
          letterSpacing: 1.3, marginTop: 2, fontWeight: 600,
        }}>SCORE</div>
      </div>
    </div>
  );
}

Object.assign(window, { Dashboard });
