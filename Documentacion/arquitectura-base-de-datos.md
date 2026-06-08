# Arquitectura de base de datos — FoodSense

## 1. Motor elegido: PostgreSQL vía Supabase

### 1.1 Relacional vs. no relacional

FoodSense gestiona datos con relaciones claras y estables: un usuario tiene items en su despensa, cada item pertenece a una categoría, las categorías tienen subcategorías, y las subcategorías determinan reglas de frescura. Este modelo se presta naturalmente a una base de datos **relacional**.

| Criterio | Relacional (PostgreSQL) | No relacional (MongoDB / Firestore) |
|---|---|---|
| Estructura de los datos | Fija y bien definida | Variable, sin esquema |
| Relaciones entre entidades | Integridad referencial nativa | Joins manuales o datos duplicados |
| Consultas típicas | Filtrar, ordenar, contar — SQL | Documentos completos |
| Consistencia | ACID garantizado | Eventual en la mayoría |
| Escalado | Vertical + read replicas | Horizontal nativo |

Las consultas centrales de la app — ordenar por fecha de vencimiento, filtrar por categoría, contar urgentes — son exactamente el tipo de operaciones para las que SQL fue diseñado. Un store de documentos agregaría complejidad sin ningún beneficio real.

### 1.2 Por qué Supabase sobre otras opciones

Supabase es un Backend-as-a-Service construido sobre PostgreSQL que elimina la necesidad de administrar infraestructura en las primeras etapas del proyecto.

**Lo que aporta sobre PostgreSQL solo:**

- **Auth integrado** (`auth.users`) con soporte para email, OAuth y magic links, sin código extra.
- **Row Level Security (RLS)** a nivel de base de datos: las reglas de acceso viven en la DB, no en el servidor de aplicación.
- **API REST y cliente JS autogenerado** a partir del schema. El frontend puede hacer queries directamente contra Supabase sin construir un backend intermedio.
- **Storage** para imágenes de productos (fotos de tickets, fotos de EAN).
- **Edge Functions** para la lógica de IA (clasificación fresco/envasado, OCR) cuando sea necesaria.
- **Generación de tipos TypeScript** (`supabase gen types`) — los tipos del frontend pueden mantenerse sincronizados con el schema automáticamente.

**Comparación con alternativas:**

| | Supabase | Firebase | PlanetScale | Neon |
|---|---|---|---|---|
| Motor | PostgreSQL | NoSQL propietario | MySQL | PostgreSQL |
| Auth incluido | Sí | Sí | No | No |
| RLS nativo | Sí | Reglas propias | No | No |
| SQL estándar | Sí | No | Sí | Sí |
| Tier gratuito | Generoso | Generoso | Limitado | Generoso |
| Migraciones | Sí (CLI) | No | Sí | Sí |

Firebase es la única alternativa con auth + hosting integrado comparable, pero su modelo NoSQL requeriría duplicar datos y perder integridad referencial.

---

## 2. Schema de la base de datos

### 2.1 Diagrama de entidades

```
auth.users (Supabase Auth)
    │
    ├── purchase_sessions ──────────────────────────────────┐
    │                                                        │
    └── pantry_items ──────────────────────────────────────►┘
              │
              ├── product_catalog ── ean (código de barras)
              │
              ├── categories
              │       └── subcategories
              │               └── freshness_rules
              └── (purchase_session_id)
```

### 2.2 Tablas de referencia

Estas tablas son compartidas entre todos los usuarios. No llevan RLS. Sus datos son prácticamente estáticos y pueden seedearse al crear el proyecto.

#### `categories`

Equivale al tipo `CategoryKey` del frontend actual.

```sql
CREATE TABLE categories (
  id    serial PRIMARY KEY,
  key   text   UNIQUE NOT NULL,  -- 'lacteos', 'verduras', 'carnes', ...
  label text   NOT NULL,         -- 'Lácteos', 'Verduras', 'Carnes', ...
  icon  text   NOT NULL          -- clave del icono SVG del diseño
);
```

**Datos iniciales:**

| key | label | icon |
|---|---|---|
| lacteos | Lácteos | dairy |
| carnes | Carnes | meat |
| verduras | Verduras | veg |
| frutas | Frutas | fruit |
| panificados | Panificados | bread |
| bebidas | Bebidas | drinks |
| huevos | Huevos | egg |
| conservas | Conservas | pantry |

#### `subcategories`

Desglosa las categorías en subcategorías para calcular fechas estimadas de frescos. Proviene directamente de la tabla de variaciones del documento de flujo.

```sql
CREATE TABLE subcategories (
  id          serial PRIMARY KEY,
  category_id int    NOT NULL REFERENCES categories(id),
  key         text   NOT NULL,  -- 'hojas_verdes', 'raices', 'citricas', ...
  label       text   NOT NULL   -- 'Hojas verdes', 'Raíces', 'Cítricas', ...
);
```

**Datos iniciales (subset):**

| category | key | label |
|---|---|---|
| verduras | hojas_verdes | Hojas verdes |
| verduras | raices | Raíces |
| verduras | frutos | Frutos |
| frutas | citricas | Cítricas |
| frutas | estacion | De estación |
| frutas | tropicales | Tropicales |
| carnes | res_cerdo | Res / Cerdo |
| carnes | pollo | Pollo |
| carnes | pescado | Pescado |

#### `freshness_rules`

Traduce la combinación subcategoría + estado visual del usuario en un rango de días. Permite modificar los valores sin tocar código.

```sql
CREATE TABLE freshness_rules (
  id              serial PRIMARY KEY,
  subcategory_id  int  NOT NULL REFERENCES subcategories(id),
  freshness_state text NOT NULL CHECK (
    freshness_state IN ('recien_comprado', 'tiene_dias', 'usalo_ya')
  ),
  days_min        int  NOT NULL,
  days_max        int  NOT NULL,
  UNIQUE (subcategory_id, freshness_state)
);
```

**Ejemplo de datos:**

| subcategoría | estado | días_min | días_max |
|---|---|---|---|
| hojas_verdes | recien_comprado | 4 | 5 |
| hojas_verdes | tiene_dias | 2 | 3 |
| hojas_verdes | usalo_ya | 0 | 1 |
| raices | recien_comprado | 18 | 21 |
| pollo | recien_comprado | 1 | 2 |

La fecha estimada se calcula como `now() + days_max` (o un promedio). En el frontend esto reemplaza la lógica hardcodeada de `urgency.ts`.

### 2.3 Catálogo de productos

Tabla compartida para productos con código EAN. Puede popularse progresivamente desde Open Food Facts o mediante el escaneo de los propios usuarios.

```sql
CREATE TABLE product_catalog (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ean         text UNIQUE,        -- NULL permitido (productos sin código)
  name        text NOT NULL,
  brand       text,
  category_id int  REFERENCES categories(id),
  image_url   text,
  source      text NOT NULL DEFAULT 'manual' CHECK (
    source IN ('open_food_facts', 'manual', 'ai')
  ),
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_product_catalog_ean ON product_catalog(ean)
  WHERE ean IS NOT NULL;
```

**Decisiones de diseño:**

- `ean` es opcional: productos frescos o ingresados manualmente no tienen código.
- `source` registra el origen del dato para poder auditar la calidad del catálogo.
- El índice parcial sobre `ean` acelera los lookups del escáner sin indexar los NULLs.

### 2.4 Despensa del usuario

Es la tabla central de la aplicación. Representa cada item que un usuario tiene en su despensa en un momento dado.

```sql
CREATE TABLE pantry_items (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Identificación del producto
  name                 text NOT NULL,
  catalog_product_id   uuid REFERENCES product_catalog(id),
  category_id          int  NOT NULL REFERENCES categories(id),
  subcategory_id       int  REFERENCES subcategories(id),

  -- Tipo de producto (determina cómo se calculó expiry_date)
  product_type         text NOT NULL CHECK (product_type IN ('fresco', 'envasado')),

  -- Estado visual (solo frescos)
  freshness_state      text CHECK (
    freshness_state IN ('recien_comprado', 'tiene_dias', 'usalo_ya')
  ),

  -- Fecha de vencimiento
  -- Envasados: exacta, leída del envase
  -- Frescos: estimada, calculada a partir de freshness_rules
  expiry_date          date NOT NULL,

  -- Ciclo de vida
  status               text NOT NULL DEFAULT 'activo' CHECK (
    status IN ('activo', 'consumido', 'descartado')
  ),
  consumed_at          timestamptz,

  -- Trazabilidad
  added_at             timestamptz NOT NULL DEFAULT now(),
  purchase_session_id  uuid REFERENCES purchase_sessions(id),

  -- Cantidad (opcional)
  quantity             numeric DEFAULT 1,
  quantity_unit        text    -- 'kg', 'L', 'unidades', NULL

  CONSTRAINT chk_fresh_has_state
    CHECK (product_type != 'fresco' OR freshness_state IS NOT NULL)
);

-- Índices para las queries más frecuentes
CREATE INDEX idx_pantry_user_status
  ON pantry_items(user_id, status, expiry_date);

CREATE INDEX idx_pantry_user_category
  ON pantry_items(user_id, category_id)
  WHERE status = 'activo';

-- Row Level Security
ALTER TABLE pantry_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usuarios ven solo su despensa"
  ON pantry_items FOR ALL
  USING (user_id = auth.uid());
```

**Decisiones de diseño:**

- **`name` denormalizado**: El nombre viene del OCR del ticket o del ingreso manual. No necesariamente coincide con el catálogo. No se fuerza consistencia porque el nombre del ticket es el que el usuario reconoce.
- **`expiry_date` unificada**: Fresco o envasado, siempre hay una fecha. La columna `product_type` indica si es exacta o estimada, sin necesidad de dos tablas separadas.
- **`status` en lugar de borrado**: Distinguir `consumido` de `descartado` habilita métricas de desperdicio evitado en sprints futuros (dashboard de impacto).
- **Constraint `chk_fresh_has_state`**: Un producto fresco sin estado visual no tiene sentido; la constraint lo impide a nivel de DB.
- **`catalog_product_id` nullable**: Los frescos nunca tienen entrada en el catálogo EAN. Los envasados la tienen si el código fue encontrado; si no, queda null.

### 2.5 Sesiones de compra

Agrupa los items que entraron a la despensa desde el mismo ticket escaneado. Permite mostrar "la compra del jueves" como unidad y facilita deshacer un ingreso completo.

```sql
CREATE TABLE purchase_sessions (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  source     text NOT NULL DEFAULT 'manual' CHECK (
    source IN ('ticket_ocr', 'manual', 'escaneo_ean')
  )
);

ALTER TABLE purchase_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usuarios ven solo sus sesiones"
  ON purchase_sessions FOR ALL
  USING (user_id = auth.uid());
```

---

## 3. Queries principales del negocio

Con este schema, las funciones centrales de `inventory.ts` se traducen directamente a SQL:

**Inventario ordenado por urgencia (US-07):**
```sql
SELECT *
FROM pantry_items
WHERE user_id = auth.uid()
  AND status = 'activo'
ORDER BY expiry_date ASC;
```

**Filtrar por categoría (US-08):**
```sql
SELECT *
FROM pantry_items
WHERE user_id = auth.uid()
  AND status = 'activo'
  AND category_id = :category_id
ORDER BY expiry_date ASC;
```

**Contar urgentes (vencen en ≤4 días):**
```sql
SELECT COUNT(*)
FROM pantry_items
WHERE user_id = auth.uid()
  AND status = 'activo'
  AND expiry_date <= CURRENT_DATE + INTERVAL '4 days';
```

**Marcar como consumido (US-09):**
```sql
UPDATE pantry_items
SET status = 'consumido', consumed_at = now()
WHERE id = :id AND user_id = auth.uid();
```

**Lookup por EAN (flujo de escaneo):**
```sql
SELECT pc.*, c.key as category_key, c.label as category_label
FROM product_catalog pc
JOIN categories c ON c.id = pc.category_id
WHERE pc.ean = :ean;
```

---

## 4. Hoja de ruta de integración

El frontend actual funciona con mocks en `src/lib/inventory.ts`. La migración a la base de datos se puede hacer de forma incremental:

| Etapa | Acción | Impacto en frontend |
|---|---|---|
| 1 | Crear schema y seedear tablas de referencia | Ninguno |
| 2 | Crear `pantry_items` y migrar los mocks como datos reales del usuario de prueba | Cambiar `inventory.ts` para usar el cliente Supabase |
| 3 | Activar Auth y RLS | Agregar `AuthProvider`, proteger rutas |
| 4 | Conectar flujo de escaneo EAN | Nueva pantalla `/escanear` consume `product_catalog` |
| 5 | Conectar reglas de frescura | Calcular `expiry_date` desde `freshness_rules` en lugar de hardcodear |

La clave es que **el contrato de `Product`** (id, name, category, daysUntilExpiry) que ya usa el frontend no cambia: solo cambia de dónde viene el dato.
