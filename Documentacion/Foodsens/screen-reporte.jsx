// screen-reporte.jsx — Reporte mensual (narrative + stats hybrid)

function Reporte() {
  return (
    <Screen padTop={4} padBottom={32}>
      {/* hero header */}
      <div style={{
        padding: '60px 22px 24px',
        background: `linear-gradient(180deg, ${T.greenWash} 0%, ${T.bg} 100%)`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <button style={iconBtn}><Icon name="chevronLeft" size={20}/></button>
          <button style={iconBtn}><Icon name="share" size={18}/></button>
        </div>
        <div style={{
          fontFamily: T.fontMono, fontSize: 11, color: T.greenDeep,
          letterSpacing: 1.4, fontWeight: 600, textTransform: 'uppercase',
        }}>
          Tu mes en FoodSense
        </div>
        <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: -1, lineHeight: 1.05, marginTop: 8 }}>
          Abril fue tu mejor mes
        </div>
        <div style={{ fontSize: 14, color: T.inkSoft, marginTop: 10, lineHeight: 1.5 }}>
          Aprovechaste casi todo lo que compraste. Te dejamos el resumen para que sepas cómo seguir.
        </div>
      </div>

      {/* big stat */}
      <div style={{ padding: '8px 18px 0' }}>
        <Card padding={22} elevated>
          <div style={{
            fontFamily: T.fontMono, fontSize: 10.5, color: T.greenDeep,
            letterSpacing: 1.3, fontWeight: 600, textTransform: 'uppercase', marginBottom: 6,
          }}>Aprovechamiento</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <div style={{ fontSize: 56, fontWeight: 700, letterSpacing: -2, lineHeight: 1, color: T.green }}>89</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: T.green, letterSpacing: -0.5 }}>%</div>
            <Chip tone="green" leading={<Icon name="trending" size={12}/>} style={{ marginLeft: 'auto', alignSelf: 'flex-end' }}>
              +12% vs marzo
            </Chip>
          </div>
          <div style={{
            marginTop: 14, height: 8, background: T.greenSoft, borderRadius: 999, overflow: 'hidden',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: '89%',
              background: `linear-gradient(90deg, ${T.green}, ${T.greenDeep})`, borderRadius: 999,
            }}/>
          </div>
          <div style={{ fontSize: 12.5, color: T.inkSoft, marginTop: 10, lineHeight: 1.4 }}>
            De los <b style={{ color: T.ink }}>38 productos</b> que registraste, usaste <b style={{ color: T.ink }}>34</b>.
          </div>
        </Card>
      </div>

      {/* dual cards: usado / vencido */}
      <div style={{ padding: '12px 18px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <Card padding={16}>
          <div style={{ color: T.green, marginBottom: 8 }}>
            <Icon name="check" size={20} strokeWidth={2.5}/>
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, lineHeight: 1, letterSpacing: -0.5 }}>34</div>
          <div style={{ fontSize: 12, color: T.inkSoft, marginTop: 6, fontWeight: 500 }}>
            Productos aprovechados
          </div>
          <div style={{ fontSize: 11, color: T.green, marginTop: 6, fontWeight: 600 }}>
            ≈ $18.400 ahorrados
          </div>
        </Card>
        <Card padding={16}>
          <div style={{ color: T.red, marginBottom: 8 }}>
            <Icon name="trash" size={20} strokeWidth={2}/>
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, lineHeight: 1, letterSpacing: -0.5 }}>4</div>
          <div style={{ fontSize: 12, color: T.inkSoft, marginTop: 6, fontWeight: 500 }}>
            Productos vencidos
          </div>
          <div style={{ fontSize: 11, color: T.inkMute, marginTop: 6, fontWeight: 500 }}>
            2 menos que en marzo
          </div>
        </Card>
      </div>

      {/* category breakdown */}
      <div style={{ padding: '24px 0 0' }}>
        <SectionHeading kicker="Por categoría">Dónde tirás más</SectionHeading>
        <div style={{ padding: '0 18px' }}>
          <Card padding={16}>
            {[
              { cat: 'verduras',    used: 12, total: 14, pct: 86 },
              { cat: 'lacteos',     used: 9,  total: 10, pct: 90 },
              { cat: 'panificados', used: 5,  total: 7,  pct: 71 },
              { cat: 'carnes',      used: 6,  total: 6,  pct: 100 },
              { cat: 'frutas',      used: 2,  total: 4,  pct: 50 },
            ].map((row, i, arr) => {
              const c = CATEGORIES[row.cat];
              const tone = row.pct >= 85 ? T.green : row.pct >= 65 ? T.amber : T.red;
              return (
                <div key={i} style={{
                  padding: '10px 0',
                  borderBottom: i < arr.length - 1 ? `1px solid ${T.borderSoft}` : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <CategoryIcon category={row.cat} size={28}/>
                    <div style={{ flex: 1, fontSize: 13.5, fontWeight: 600 }}>{c.label}</div>
                    <div style={{ fontFamily: T.fontMono, fontSize: 11.5, color: T.inkSoft, fontWeight: 500 }}>
                      {row.used}/{row.total}
                    </div>
                    <div style={{ fontFamily: T.fontMono, fontSize: 12, fontWeight: 700, color: tone, minWidth: 36, textAlign: 'right' }}>
                      {row.pct}%
                    </div>
                  </div>
                  <div style={{ height: 5, background: T.borderSoft, borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{
                      width: `${row.pct}%`, height: '100%', background: tone, borderRadius: 999,
                    }}/>
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      </div>

      {/* highlights */}
      <div style={{ padding: '24px 0 0' }}>
        <SectionHeading kicker="Highlights">Momentos del mes</SectionHeading>
        <div style={{
          display: 'flex', gap: 10, overflowX: 'auto', padding: '0 18px 6px',
        }}>
          <HighlightCard
            icon="trending"
            tone="green"
            value="7 días"
            label="seguidos sin tirar nada"
          />
          <HighlightCard
            icon="fridge"
            tone="amber"
            value="Lunes"
            label="el día que más cocinaste"
          />
          <HighlightCard
            icon="sparkle"
            tone="green"
            value="3 recetas"
            label="usaste de FoodSense"
          />
        </div>
      </div>

      {/* gentle next steps */}
      <div style={{ padding: '24px 18px 0' }}>
        <Card padding={18} style={{ background: T.amberWash, border: `1px solid ${T.amberSoft}` }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: T.rFull,
              background: T.amber, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Icon name="sparkle" size={18} strokeWidth={2}/>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.amberDeep, letterSpacing: -0.2 }}>
                Un consejo para mayo
              </div>
              <div style={{ fontSize: 13, color: T.ink, marginTop: 6, lineHeight: 1.45 }}>
                Tus <b>frutas</b> son las que más se vencen. Probá comprar menos cantidad o congelarlas para licuados.
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* share footer */}
      <div style={{ padding: '20px 18px 0', display: 'flex', gap: 8 }}>
        <Button variant="secondary" size="lg" full leading={<Icon name="share" size={18}/>}>
          Compartir resumen
        </Button>
      </div>
    </Screen>
  );
}

function HighlightCard({ icon, tone, value, label }) {
  const isGreen = tone === 'green';
  return (
    <div style={{
      flexShrink: 0, width: 160,
      background: T.surface, border: `1px solid ${T.border}`,
      borderRadius: T.rLg, padding: 14,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: T.rFull,
        background: isGreen ? T.greenSoft : T.amberSoft,
        color: isGreen ? T.green : T.amberDeep,
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10,
      }}>
        <Icon name={icon} size={16} strokeWidth={2}/>
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.3, lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: 11.5, color: T.inkSoft, marginTop: 4, lineHeight: 1.35 }}>{label}</div>
    </div>
  );
}

Object.assign(window, { Reporte });
