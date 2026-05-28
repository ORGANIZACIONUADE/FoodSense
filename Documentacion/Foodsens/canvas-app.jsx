// canvas-app.jsx — main canvas composition for FoodSense hi-fi

const PHONE_W = 390;
const PHONE_H = 844;

// wraps a screen inside the iPhone frame, without IOSDevice's nav bar
function Phone({ children }) {
  return (
    <IOSDevice width={PHONE_W} height={PHONE_H}>
      <div style={{ position: 'absolute', inset: 0 }}>
        {children}
      </div>
    </IOSDevice>
  );
}

const AB_W = PHONE_W + 8;
const AB_H = PHONE_H + 8;

function CoverArtboard() {
  return (
    <div style={{
      width: '100%', height: '100%', background: T.bg, padding: 32,
      fontFamily: T.font, color: T.ink, boxSizing: 'border-box',
      overflowY: 'auto', display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: T.green, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="sparkle" size={22} strokeWidth={2.25}/>
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.4 }}>FoodSense</div>
          <div style={{ fontSize: 12, color: T.inkSoft }}>Hi-fi · v1</div>
        </div>
      </div>

      <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: -1, lineHeight: 1.05, marginBottom: 14 }}>
        Cuidá tu heladera, cuidá tu plata
      </div>
      <div style={{ fontSize: 14.5, color: T.inkSoft, lineHeight: 1.5, marginBottom: 24 }}>
        Una PWA para adultos urbanos de Argentina. Reduce el desperdicio alimentario doméstico
        mediante registro inteligente, seguimiento de vencimientos y alertas preventivas — con tono empático.
      </div>

      {/* Color tokens */}
      <SystemBlock title="Color tokens">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {[
            { c: T.green,    n: 'green', h: T.green },
            { c: T.amber,    n: 'amber', h: T.amber },
            { c: T.red,      n: 'red',   h: T.red },
            { c: T.ink,      n: 'ink',   h: T.ink },
            { c: T.greenSoft, n: 'green/soft', h: T.greenSoft },
            { c: T.amberSoft, n: 'amber/soft', h: T.amberSoft },
            { c: T.redSoft,   n: 'red/soft',   h: T.redSoft },
            { c: T.surfaceAlt,n: 'surface/alt', h: T.surfaceAlt },
          ].map((s, i) => (
            <div key={i}>
              <div style={{
                width: '100%', aspectRatio: '1.6/1', borderRadius: 8,
                background: s.c, border: `1px solid ${T.border}`,
              }}/>
              <div style={{ fontSize: 10.5, marginTop: 5, fontWeight: 600 }}>{s.n}</div>
              <div style={{ fontFamily: T.fontMono, fontSize: 9.5, color: T.inkMute }}>{s.h}</div>
            </div>
          ))}
        </div>
      </SystemBlock>

      {/* Type */}
      <SystemBlock title="Tipografía · Plus Jakarta Sans">
        <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.6, lineHeight: 1.1 }}>
          Display · 28/700
        </div>
        <div style={{ fontSize: 17, fontWeight: 600, marginTop: 6 }}>Title · 17/600</div>
        <div style={{ fontSize: 14.5, fontWeight: 500, marginTop: 6 }}>Body · 14.5/500</div>
        <div style={{ fontSize: 12, color: T.inkSoft, marginTop: 6 }}>Caption · 12/500 inkSoft</div>
        <div style={{ fontFamily: T.fontMono, fontSize: 11, marginTop: 6, letterSpacing: 1.2, color: T.inkMute, textTransform: 'uppercase' }}>
          Mono · JetBrains Mono
        </div>
      </SystemBlock>

      {/* Components */}
      <SystemBlock title="Componentes clave">
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          <Button size="sm">Primary</Button>
          <Button size="sm" variant="secondary">Secondary</Button>
          <Button size="sm" variant="ghost">Ghost</Button>
          <Button size="sm" variant="amber">Amber</Button>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          <Chip>Default</Chip>
          <Chip tone="green">Aprovechado</Chip>
          <Chip tone="amber">Pronto</Chip>
          <Chip tone="red" solid>Vence hoy</Chip>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          <DaysPill days={0}/>
          <DaysPill days={2}/>
          <DaysPill days={7}/>
          <DaysPill days={30}/>
        </div>
      </SystemBlock>

      <div style={{ marginTop: 'auto', paddingTop: 18 }}>
        <div style={{
          padding: 14, borderRadius: T.rMd,
          background: T.greenWash, border: `1px solid ${T.greenSoft}`,
          fontSize: 12.5, color: T.greenDeep, lineHeight: 1.45,
        }}>
          <b>Para Claude Code:</b> abrí <span style={{ fontFamily: T.fontMono, background: T.surface, padding: '2px 6px', borderRadius: 4 }}>HANDOFF.md</span> para
          ver la guía de implementación a Next.js + Tailwind.
        </div>
      </div>
    </div>
  );
}

function SystemBlock({ title, children }) {
  return (
    <div style={{
      padding: 16, borderRadius: T.rLg,
      background: T.surface, border: `1px solid ${T.border}`,
      marginBottom: 12,
    }}>
      <div style={{
        fontFamily: T.fontMono, fontSize: 10.5, color: T.inkSoft,
        letterSpacing: 1.3, textTransform: 'uppercase', fontWeight: 600, marginBottom: 12,
      }}>{title}</div>
      {children}
    </div>
  );
}

function App() {
  return (
    <DesignCanvas>
      <DCSection id="cover" title="FoodSense — Hi-Fi" subtitle="Sistema, tokens y 8 pantallas listas para handoff">
        <DCArtboard id="cover" label="Cover · Sistema" width={520} height={AB_H}>
          <CoverArtboard/>
        </DCArtboard>
      </DCSection>

      <DCSection id="flow-onboarding" title="Onboarding" subtitle="Primer ingreso · 3 slides">
        <DCArtboard id="onb-1" label="01 · Bienvenida" width={AB_W} height={AB_H}>
          <Phone><Onboarding1/></Phone>
        </DCArtboard>
        <DCArtboard id="onb-2" label="02 · Cómo funciona" width={AB_W} height={AB_H}>
          <Phone><Onboarding2/></Phone>
        </DCArtboard>
        <DCArtboard id="onb-3" label="03 · Avisos" width={AB_W} height={AB_H}>
          <Phone><Onboarding3/></Phone>
        </DCArtboard>
      </DCSection>

      <DCSection id="main" title="Pantallas principales" subtitle="Dashboard · Despensa · Detalle · Alertas">
        <DCArtboard id="dashboard" label="Dashboard / Inicio" width={AB_W} height={AB_H}>
          <Phone><Dashboard/></Phone>
        </DCArtboard>
        <DCArtboard id="despensa" label="Despensa" width={AB_W} height={AB_H}>
          <Phone><Despensa/></Phone>
        </DCArtboard>
        <DCArtboard id="detalle" label="Detalle de producto" width={AB_W} height={AB_H}>
          <Phone><Detalle/></Phone>
        </DCArtboard>
        <DCArtboard id="alertas" label="Alertas" width={AB_W} height={AB_H}>
          <Phone><Alertas/></Phone>
        </DCArtboard>
      </DCSection>

      <DCSection id="flows" title="Flujos secundarios" subtitle="Escaneo · Agregar manual · Reporte mensual">
        <DCArtboard id="escaneo" label="Escaneo (cámara)" width={AB_W} height={AB_H}>
          <Phone><Escaneo/></Phone>
        </DCArtboard>
        <DCArtboard id="agregar" label="Agregar manual" width={AB_W} height={AB_H}>
          <Phone><AgregarManual/></Phone>
        </DCArtboard>
        <DCArtboard id="reporte" label="Reporte mensual" width={AB_W} height={AB_H}>
          <Phone><Reporte/></Phone>
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
