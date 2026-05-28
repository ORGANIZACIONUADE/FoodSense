// screen-despensa.jsx — Despensa list (variant A: grouped by category)

function Despensa() {
  const groups = [
    {
      key: 'lacteos', count: 6, items: [
        { name: 'Yogur natural Ilolay',  state: 'abierto', days: 0  },
        { name: 'Queso cremoso Paulina', state: 'abierto', days: 4  },
        { name: 'Leche entera Serenísima', state: 'cerrado', days: 8 },
      ],
    },
    {
      key: 'verduras', count: 5, items: [
        { name: 'Lechuga mantecosa', state: 'cerrado', days: 2  },
        { name: 'Tomate perita',     state: 'cerrado', days: 6  },
      ],
    },
    {
      key: 'carnes', count: 4, items: [
        { name: 'Pollo trozado',    state: 'congelado', days: 30 },
        { name: 'Bondiola fresca',  state: 'cerrado',   days: 3  },
      ],
    },
  ];

  return (
    <Screen padTop={4}>
      {/* sticky-ish header */}
      <div style={{ padding: '60px 18px 8px', background: T.bg }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14,
        }}>
          <div>
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.5, lineHeight: 1 }}>Despensa</div>
            <div style={{ fontSize: 12.5, color: T.inkSoft, marginTop: 4 }}>24 productos · 8 estados activos</div>
          </div>
          <button style={{
            width: 44, height: 44, borderRadius: T.rFull,
            background: T.green, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: 'pointer', boxShadow: T.shadowMd,
          }}>
            <Icon name="plus" size={22} strokeWidth={2.25}/>
          </button>
        </div>

        {/* search */}
        <div style={{
          height: 44, borderRadius: T.rMd, background: T.surface,
          border: `1px solid ${T.border}`,
          display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10, marginBottom: 12,
        }}>
          <Icon name="search" size={18} color={T.inkMute}/>
          <span style={{ fontSize: 14, color: T.inkMute }}>Buscar en la despensa…</span>
          <div style={{ flex: 1 }}/>
          <Icon name="filter" size={18} color={T.inkSoft}/>
        </div>

        {/* category chips */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, margin: '0 -18px', padding: '0 18px 4px' }}>
          <Chip tone="green" solid>Todos · 24</Chip>
          <Chip>Lácteos · 6</Chip>
          <Chip>Verduras · 5</Chip>
          <Chip>Carnes · 4</Chip>
          <Chip>Frutas · 3</Chip>
          <Chip>Panificados · 2</Chip>
        </div>
      </div>

      {/* state filter */}
      <div style={{ padding: '12px 18px 4px', display: 'flex', gap: 6 }}>
        <Chip tone="green" leading={<Icon name="closed" size={12}/>}>Cerrado · 14</Chip>
        <Chip tone="amber" leading={<Icon name="open" size={12}/>}>Abierto · 7</Chip>
        <Chip tone="neutral" leading={<Icon name="snow" size={12}/>}>Congelado · 3</Chip>
      </div>

      {/* groups */}
      <div style={{ padding: '12px 18px 0' }}>
        {groups.map((g, gi) => {
          const cat = CATEGORIES[g.key];
          return (
            <div key={gi} style={{ marginBottom: 18 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, padding: '0 4px',
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 8,
                  background: cat.tint, color: cat.stroke,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name={cat.icon} size={15} strokeWidth={2}/>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: -0.2 }}>{cat.label}</div>
                <div style={{ flex: 1, height: 1, background: T.borderSoft }}/>
                <div style={{
                  fontFamily: T.fontMono, fontSize: 11, color: T.inkMute, fontWeight: 500,
                }}>{g.count} ítems</div>
              </div>
              <Card padding={0} style={{ padding: '4px 16px' }}>
                {g.items.map((it, i) => (
                  <ProductRow
                    key={i}
                    name={it.name}
                    category={g.key}
                    state={it.state}
                    days={it.days}
                    divider={i < g.items.length - 1}
                  />
                ))}
              </Card>
            </div>
          );
        })}
      </div>

      <TabBar active="pantry"/>
    </Screen>
  );
}

Object.assign(window, { Despensa });
