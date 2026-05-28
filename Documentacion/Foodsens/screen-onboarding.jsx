// screen-onboarding.jsx — 3 slides intro (single artboard view, horizontally arranged)

function OnboardingSlide({ index, total, eyebrow, title, body, illustration, primaryLabel, secondaryLabel }) {
  return (
    <Screen padTop={60} padBottom={36}>
      <div style={{ padding: '8px 24px 0', display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* brand mark + skip */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <BrandMark />
          <div style={{ fontSize: 13, color: T.inkSoft, fontWeight: 500 }}>
            {index < total - 1 ? 'Saltar' : ''}
          </div>
        </div>

        {/* illustration */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 240 }}>
          {illustration}
        </div>

        {/* dots */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 18 }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{
              width: i === index ? 22 : 6, height: 6, borderRadius: 999,
              background: i === index ? T.green : T.border,
              transition: 'all .2s',
            }}/>
          ))}
        </div>

        {/* copy */}
        <div style={{ marginBottom: 22 }}>
          <div style={{
            fontFamily: T.fontMono, fontSize: 11, color: T.green, fontWeight: 600,
            letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 8,
          }}>{eyebrow}</div>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.6, lineHeight: 1.1, marginBottom: 10 }}>
            {title}
          </div>
          <div style={{ fontSize: 15, lineHeight: 1.45, color: T.inkSoft }}>
            {body}
          </div>
        </div>

        {/* actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Button variant="primary" size="lg" full>{primaryLabel}</Button>
          {secondaryLabel && (
            <Button variant="ghost" size="md" full>{secondaryLabel}</Button>
          )}
        </div>
      </div>
    </Screen>
  );
}

function BrandMark() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: 28, height: 28, borderRadius: 9,
        background: T.green, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name="sparkle" size={16} strokeWidth={2.25}/>
      </div>
      <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: -0.4 }}>
        FoodSense
      </div>
    </div>
  );
}

// Illustration 1: stylized fridge with floating items
function IllusFridge() {
  return (
    <div style={{ position: 'relative', width: 220, height: 240 }}>
      {/* Fridge body */}
      <div style={{
        position: 'absolute', left: 50, top: 30, width: 120, height: 180,
        background: T.greenWash, border: `2px solid ${T.green}`, borderRadius: 22,
      }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 70, height: 2, background: T.green }}/>
        <div style={{ position: 'absolute', right: 10, top: 24, width: 4, height: 14, borderRadius: 2, background: T.green }}/>
        <div style={{ position: 'absolute', right: 10, top: 90, width: 4, height: 14, borderRadius: 2, background: T.green }}/>
      </div>
      {/* Floating chips */}
      <div style={{
        position: 'absolute', left: -8, top: 50,
        background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12,
        padding: '8px 12px', boxShadow: T.shadowMd,
        display: 'flex', alignItems: 'center', gap: 8, transform: 'rotate(-6deg)',
      }}>
        <CategoryIcon category="verduras" size={24}/>
        <span style={{ fontSize: 12, fontWeight: 600 }}>Lechuga</span>
        <DaysPill days={2}/>
      </div>
      <div style={{
        position: 'absolute', right: -16, top: 110,
        background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12,
        padding: '8px 12px', boxShadow: T.shadowMd,
        display: 'flex', alignItems: 'center', gap: 8, transform: 'rotate(5deg)',
      }}>
        <CategoryIcon category="lacteos" size={24}/>
        <span style={{ fontSize: 12, fontWeight: 600 }}>Yogur</span>
        <DaysPill days={0}/>
      </div>
      <div style={{
        position: 'absolute', left: 10, bottom: 8,
        background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12,
        padding: '8px 12px', boxShadow: T.shadowMd,
        display: 'flex', alignItems: 'center', gap: 8, transform: 'rotate(-3deg)',
      }}>
        <CategoryIcon category="carnes" size={24}/>
        <span style={{ fontSize: 12, fontWeight: 600 }}>Pollo</span>
        <DaysPill days={12}/>
      </div>
    </div>
  );
}

// Illustration 2: barcode scan
function IllusScan() {
  return (
    <div style={{
      width: 200, height: 240, position: 'relative',
      borderRadius: 28, background: T.amberWash,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* scan frame */}
      <div style={{
        width: 150, height: 150, borderRadius: 18,
        background: T.surface, boxShadow: T.shadowLg, position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* corners */}
        {[
          { top: 8, left: 8, br: '0 0 0 0', bt: '8px 0 0 8px' },
          { top: 8, right: 8, br: '0 0 0 0', bt: '8px 8px 0 0' },
          { bottom: 8, left: 8, br: '0 0 0 0', bt: '0 0 0 8px' },
          { bottom: 8, right: 8, br: '0 0 0 0', bt: '0 0 8px 0' },
        ].map((c, i) => (
          <div key={i} style={{
            position: 'absolute', ...c, width: 22, height: 22,
            borderRadius: c.bt,
            borderTop: i < 2 ? `3px solid ${T.amber}` : 'none',
            borderBottom: i >= 2 ? `3px solid ${T.amber}` : 'none',
            borderLeft: i % 2 === 0 ? `3px solid ${T.amber}` : 'none',
            borderRight: i % 2 === 1 ? `3px solid ${T.amber}` : 'none',
          }}/>
        ))}
        <Icon name="barcode" size={64} color={T.ink} strokeWidth={2}/>
        {/* scan line */}
        <div style={{
          position: 'absolute', left: 8, right: 8, top: '50%', height: 2,
          background: T.amber, boxShadow: `0 0 12px ${T.amber}`,
        }}/>
      </div>
      {/* sparkle */}
      <div style={{
        position: 'absolute', top: 14, right: 18,
        background: T.surface, borderRadius: 999, padding: 6, boxShadow: T.shadowMd,
        color: T.amber,
      }}>
        <Icon name="sparkle" size={18} strokeWidth={2.25}/>
      </div>
    </div>
  );
}

// Illustration 3: gentle bell with notifications
function IllusAlerts() {
  return (
    <div style={{ position: 'relative', width: 220, height: 240 }}>
      <div style={{
        position: 'absolute', left: 60, top: 40, width: 100, height: 100,
        borderRadius: T.rFull, background: T.greenWash, color: T.green,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: `2px solid ${T.green}`,
      }}>
        <Icon name="bell" size={48} strokeWidth={2}/>
      </div>
      {/* notification cards stacked */}
      <div style={{
        position: 'absolute', right: -4, top: 16,
        background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14,
        padding: 12, boxShadow: T.shadowMd, width: 160, transform: 'rotate(4deg)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: 999, background: T.amber }}/>
          <div style={{ fontSize: 10, fontWeight: 600, color: T.inkSoft, letterSpacing: 0.4, textTransform: 'uppercase' }}>Hoy 09:00</div>
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>Tu lechuga estará perfecta hasta el viernes</div>
      </div>
      <div style={{
        position: 'absolute', left: -4, bottom: 16,
        background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14,
        padding: 12, boxShadow: T.shadowMd, width: 170, transform: 'rotate(-3deg)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: 999, background: T.green }}/>
          <div style={{ fontSize: 10, fontWeight: 600, color: T.inkSoft, letterSpacing: 0.4, textTransform: 'uppercase' }}>Mañana 19:30</div>
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>Idea: receta con yogur y palta 🥑</div>
      </div>
    </div>
  );
}

function Onboarding1() {
  return (
    <OnboardingSlide
      index={0} total={3}
      eyebrow="Bienvenida"
      title="Cuidá tu heladera, cuidá tu plata"
      body="FoodSense te ayuda a saber qué tenés y qué vence pronto. Sin culpa, sin estrés — solo claridad."
      illustration={<IllusFridge/>}
      primaryLabel="Empezar"
      secondaryLabel="Ya tengo cuenta"
    />
  );
}

function Onboarding2() {
  return (
    <OnboardingSlide
      index={1} total={3}
      eyebrow="Cómo funciona"
      title="Escaneá el código y listo"
      body="Reconocemos el producto, sugerimos la categoría y la fecha de vencimiento. Vos confirmás y seguís."
      illustration={<IllusScan/>}
      primaryLabel="Siguiente"
      secondaryLabel="Saltar tour"
    />
  );
}

function Onboarding3() {
  return (
    <OnboardingSlide
      index={2} total={3}
      eyebrow="Avisos amables"
      title="Te avisamos a tiempo"
      body="Una nota suave antes de que algo se venza. Sin notificaciones invasivas — solo lo justo y útil."
      illustration={<IllusAlerts/>}
      primaryLabel="Activar notificaciones"
      secondaryLabel="Después"
    />
  );
}

Object.assign(window, { Onboarding1, Onboarding2, Onboarding3, BrandMark });
