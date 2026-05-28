// screen-alertas.jsx — Alertas (variant A: conversational feed by day)

function Alertas() {
  return (
    <Screen padTop={4}>
      {/* header */}
      <div style={{ padding: '60px 18px 16px', background: T.bg }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <div>
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.5, lineHeight: 1 }}>Alertas</div>
            <div style={{ fontSize: 13, color: T.inkSoft, marginTop: 6, lineHeight: 1.4 }}>
              3 cosas para mirar hoy — nada urgente, todo con tiempo.
            </div>
          </div>
          <button style={iconBtn}><Icon name="settings" size={18}/></button>
        </div>
      </div>

      {/* mood summary */}
      <div style={{ padding: '0 18px 6px' }}>
        <Card padding={14} style={{ background: T.greenWash, border: `1px solid ${T.greenSoft}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: T.rFull,
              background: T.green, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="sparkle" size={20} strokeWidth={2}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.greenDeep, letterSpacing: -0.2 }}>
                Vas mejor que la semana pasada
              </div>
              <div style={{ fontSize: 12.5, color: T.inkSoft, marginTop: 2 }}>
                Tiraste 2 productos menos. Buen ritmo.
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* day: today */}
      <DayHeader label="Hoy" date="14 may"/>
      <div style={{ padding: '0 18px' }}>
        <AlertBubble
          tone="red"
          time="08:30"
          product="Yogur natural"
          category="lacteos"
          message={<>Tu <b>yogur natural</b> vence hoy. Si lo abrís ahora, todavía está en su mejor momento.</>}
          actions={[
            { label: 'Ver receta', variant: 'primary', icon: 'sparkle' },
            { label: 'Lo usé', variant: 'secondary' },
            { label: 'Posponer', variant: 'ghost' },
          ]}
        />
        <AlertBubble
          tone="amber"
          time="09:00"
          product="Lechuga mantecosa"
          category="verduras"
          message={<>La <b>lechuga</b> que compraste el 9 va a estar mejor en los próximos 2 días.</>}
          actions={[
            { label: 'Ver opciones', variant: 'primary' },
            { label: 'Marcar usado', variant: 'secondary' },
          ]}
        />
      </div>

      {/* day: tomorrow */}
      <DayHeader label="Mañana" date="15 may"/>
      <div style={{ padding: '0 18px' }}>
        <AlertBubble
          tone="amber"
          time="08:00"
          product="Queso cremoso"
          category="lacteos"
          scheduled
          message={<>Te avisaremos cuando tu <b>queso cremoso</b> esté próximo a vencer.</>}
        />
      </div>

      {/* footer setting */}
      <div style={{ padding: '20px 18px 8px' }}>
        <Card padding={14} style={{ borderStyle: 'dashed', background: T.bg }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="bell" size={18} color={T.inkSoft}/>
            <div style={{ flex: 1, fontSize: 12.5, color: T.inkSoft, lineHeight: 1.4 }}>
              Recibís alertas <b style={{ color: T.ink }}>2 días antes</b> de cada vencimiento.
            </div>
            <span style={{ fontSize: 12.5, color: T.green, fontWeight: 600 }}>Ajustar</span>
          </div>
        </Card>
      </div>

      <TabBar active="alerts"/>
    </Screen>
  );
}

function DayHeader({ label, date }) {
  return (
    <div style={{
      padding: '20px 18px 10px',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <div style={{
        fontFamily: T.fontMono, fontSize: 11, fontWeight: 600,
        letterSpacing: 1.3, color: T.inkSoft, textTransform: 'uppercase',
      }}>{label}</div>
      <div style={{ flex: 1, height: 1, background: T.border }}/>
      <div style={{
        fontFamily: T.fontMono, fontSize: 11, color: T.inkMute, fontWeight: 500,
      }}>{date}</div>
    </div>
  );
}

function AlertBubble({ tone, time, product, category, message, actions = [], scheduled = false }) {
  const tones = {
    red:   { fg: T.red,   bg: T.redWash,   border: T.redSoft,   stroke: T.redDeep   },
    amber: { fg: T.amber, bg: T.amberWash, border: T.amberSoft, stroke: T.amberDeep },
    green: { fg: T.green, bg: T.greenWash, border: T.greenSoft, stroke: T.greenDeep },
  };
  const tn = tones[tone];

  return (
    <div style={{ marginBottom: 12 }}>
      {/* meta strip */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, paddingLeft: 4,
      }}>
        <div style={{
          width: 7, height: 7, borderRadius: 999, background: tn.fg,
          boxShadow: `0 0 0 3px ${tn.bg}`,
        }}/>
        <div style={{
          fontFamily: T.fontMono, fontSize: 10.5, fontWeight: 600,
          color: T.inkSoft, letterSpacing: 0.6,
        }}>
          {time} · {product}
        </div>
      </div>

      {/* bubble */}
      <div style={{
        background: T.surface, border: `1px solid ${T.border}`,
        borderRadius: 18, borderTopLeftRadius: 6,
        padding: 14, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
          background: tn.fg,
        }}/>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, paddingLeft: 4 }}>
          <CategoryIcon category={category} size={36}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, lineHeight: 1.45, color: T.ink }}>
              {message}
            </div>
            {scheduled ? (
              <div style={{ marginTop: 10 }}>
                <Chip tone="neutral" leading={<Icon name="clock" size={11}/>}>Programada</Chip>
              </div>
            ) : actions.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
                {actions.map((a, i) => (
                  <Button
                    key={i}
                    variant={a.variant}
                    size="sm"
                    leading={a.icon ? <Icon name={a.icon} size={14} strokeWidth={2}/> : null}
                  >{a.label}</Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Alertas });
