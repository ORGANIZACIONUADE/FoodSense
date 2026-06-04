# Motor de sugerencias — FoodSense

## 1. La idea

Cuando un usuario ingresa un producto (por escaneo de EAN, por ticket OCR, o manualmente), el sistema puede sugerirle automáticamente la **categoría** y los **días estimados de vencimiento**, sin intervención de IA ni red neuronal, usando únicamente la acumulación estadística de lo que otros usuarios ya cargaron para el mismo producto.

Con suficientes muestras, el sistema aprende que "Leche La Serenísima 1L" pertenece a `lacteos`, y que los frescos de tipo "hojas verdes" en estado "recién comprado" duran entre 4 y 5 días. El usuario solo tiene que confirmar o corregir.

---

## 2. El problema central: dos productos distintos con el mismo EAN

Antes de diseñar el sistema, hay que entender por qué la estadística de fechas tiene un límite estructural para productos envasados.

Cuando alguien compra "Leche Serenísima 1L" hoy, la fecha impresa en el envase depende de **cuándo se produjo ese lote**, no del producto en sí. Si la comprás el día que llega al supermercado, quedan 45 días. Si la comprás una semana antes de que la retiren del góndola, quedan 7. Mismo EAN, misma categoría, vida útil completamente distinta.

El dato `expiry_date - added_at` para envasados tiene varianza alta por una razón estructural: **la fecha de vencimiento no es una propiedad del producto, es una propiedad del lote de producción**.

Esto genera un estado de máxima entropía en el modelo: no importa cuántas muestras acumulemos, la incertidumbre no se reduce lo suficiente como para hacer una sugerencia útil de fecha.

La consecuencia directa es que **el motor de sugerencias sirve para cosas distintas según el tipo de producto**.

---

## 3. Separación de los dos problemas

### 3.1 Envasados: el problema no es estimar, es capturar

La fecha de vencimiento **está impresa en el envase**. El usuario la tiene enfrente. El problema no es que no sepamos cuándo vence — es que cargarla genera fricción. La solución no es estadística: es hacer más fácil la captura del dato real.

Opciones ordenadas por fricción descendente:

| Método | Fricción | Descripción |
|---|---|---|
| OCR de la fecha impresa | Mínima | La cámara apunta al envase y lee "VTO: 12/08/26" automáticamente |
| Shelf life desde Open Food Facts | Baja | El EAN trae un mínimo probable como punto de partida editable |
| Ingreso manual | Alta | El usuario escribe la fecha a mano |

**El motor estadístico para envasados solo sirve para sugerir categoría y nombre, no fecha.**

### 3.2 Frescos: el problema sí es estimar

Los frescos no tienen fecha impresa. Acá la estadística es la herramienta correcta porque:

- La varianza está acotada por la bioquímica del producto (una lechuga no dura 3 meses)
- El `freshness_state` que elige el usuario reduce la incertidumbre antes de calcular
- Los valores de `freshness_rules` ya son rangos, no puntos exactos
- Con suficientes muestras, los rangos se refinan automáticamente

| | Envasados | Frescos |
|---|---|---|
| ¿Tiene fecha impresa? | Sí | No |
| ¿Para qué sirve la estadística? | Solo categoría y nombre | Fecha estimada |
| ¿Cómo reducir la incertidumbre? | No estimar — capturar el dato real | CV + rangos + freshness_state |
| ¿Cómo corregir errores posteriores? | El usuario tiene el dato exacto | Feedback al momento de descartar |

---

## 4. Fuentes de datos

Toda la información necesaria ya está capturada en el schema de `pantry_items`:

| Campo | Para qué sirve en el motor |
|---|---|
| `name` | Identificar el producto en frescos o manuales |
| `catalog_product_id` | Identificar el producto en envasados (EAN) |
| `category_id` | Sugerir categoría |
| `added_at` | Momento de ingreso |
| `expiry_date` | Fecha de vencimiento |
| `expiry_date - added_at` | Vida útil desde la compra — dato base para frescos |
| `product_type` | Separar frescos de envasados |
| `status` | Filtrar solo ítems válidos |

---

## 5. El algoritmo

### 5.1 Identificación del producto

**Envasados (con EAN):** la identidad es exacta. El código de barras es único. Todos los que cargaron ese EAN están hablando del mismo producto.

**Frescos y manuales (sin EAN):** la identidad es por nombre. "Lechuga mantecosa", "lechuga Mantecosa" y "Lechuga" son probablemente el mismo producto. Se necesita normalización y similitud textual.

### 5.2 Normalización de nombres

Antes de comparar nombres se aplica una pipeline:

1. Convertir a minúsculas
2. Eliminar acentos (`unaccent` — extensión nativa de PostgreSQL)
3. Eliminar caracteres especiales y espacios dobles

```sql
lower(trim(unaccent(name)))
```

Para coincidencias parciales, PostgreSQL ofrece la extensión `pg_trgm` que calcula similitud por trigramas sin IA:

```sql
SELECT similarity('lechuga mantecosa', 'lechuga manteca');
-- 0.52 — coincidencia parcial

SELECT similarity('lechuga mantecosa', 'tomate perita');
-- 0.08 — no coincide
```

Un umbral de similitud de **0.4** captura variaciones de escritura del mismo producto sin generar falsos positivos frecuentes.

### 5.3 Estadísticos por producto

Para cada producto identificado se calculan:

| Estadístico | Cómo se usa |
|---|---|
| `n` (cantidad de muestras) | Determina el nivel de confianza |
| Mediana de `vida_util_dias` | Sugerencia principal — más robusta que el promedio ante outliers |
| Desvío estándar | Mide dispersión — determina si el dato es confiable |
| Coeficiente de variación (CV) | Filtra si la distribución tiene demasiada entropía |
| Moda de `category_id` | Categoría más frecuentemente asignada |

**Por qué mediana y no promedio:**
Si 9 usuarios cargan leche con 15 días de vida útil y uno la cargó 3 meses antes de que venciera (compra por mayor), el promedio sube a ~22 días. La mediana sigue siendo 15. La mediana es resistente a outliers sin necesitar descartarlos explícitamente.

### 5.4 Filtro por coeficiente de variación

El CV mide cuánto varía el dato relativo a su valor central:

```
CV = desvío_estándar / mediana
```

| CV | Interpretación | Acción |
|---|---|---|
| < 0.2 | Producto predecible | Sugerir fecha con confianza |
| 0.2 – 0.5 | Variabilidad normal | Sugerir como rango ("entre X y Y días") |
| > 0.5 | Alta entropía | No sugerir fecha — pedir al usuario |

Un CV alto es la señal de que más muestras no van a resolver el problema: la incertidumbre es estructural, no estadística.

### 5.5 Niveles de confianza

El nivel de confianza combina cantidad de muestras y CV:

| Muestras (n) | CV | Nivel | Comportamiento en UI |
|---|---|---|---|
| 0–2 | cualquiera | Sin datos | No se sugiere. Se usa `freshness_rules` para frescos; se pide al usuario para envasados |
| 3–9 | < 0.5 | Baja | Sugerencia con indicador visual de baja confianza |
| 10–29 | < 0.5 | Media | Se pre-completa el campo. El usuario puede editarlo |
| 30+ | < 0.3 | Alta | Se aplica automáticamente. El usuario puede editarlo |
| cualquiera | > 0.5 | Sin datos (alta entropía) | No se sugiere fecha aunque haya muestras |

### 5.6 Detección de outliers

Antes de incluir una muestra se verifica que no sea un dato corrupto:

```
es_outlier = ABS(muestra - mediana_actual) > 3 × desvío_estándar
```

Muestras fuera de 3 desvíos estándar no se incluyen en el cálculo (regla de Chauvenet simplificada). Filtra errores de carga sin revisión manual.

---

## 6. Flujo de una sugerencia

```
Usuario ingresa producto
        │
        ├── ¿Tiene EAN? ──────────────────────────────────────────────────┐
        │         │ Sí                                                     │ No
        │         ▼                                                        ▼
        │   Buscar en product_catalog_stats                  Normalizar nombre
        │         │                                          Buscar en product_name_stats
        │         │                                          con similitud > 0.4 (pg_trgm)
        └─────────┴──────────────────────────────────────────────────────┘
                  │
                  ▼
         Evaluar confidence_level
                  │
     ┌────────────┼──────────────┬──────────────────┐
     │            │              │                  │
  'alta'       'media'        'baja'           'sin_datos'
     │            │              │                  │
Auto-completa Pre-completa  Sugerencia con     Frescos: usar freshness_rules
  (editable)  (editable)    "pocos datos"      Envasados: pedir al usuario
                                  │
                             ┌────┴─────┐
                             │ Acepta?  │
                          Sí │          │ No
                             ▼          ▼
                    Guardar feedback  Guardar corrección
                    accepted=true     → mejora el modelo
```

---

## 7. El feedback loop como corrector

Cuando el usuario descarta un producto antes de su fecha estimada, eso es señal de que el modelo estimó mal. Pero hay ambigüedad: **no se sabe si lo descartó porque venció antes de lo estimado, o porque decidió no consumirlo**.

Para capturar el dato correcto se necesita una pregunta al momento del descarte:

> "¿Por qué lo descartaste?"
> `[Venció antes] [No lo usé a tiempo] [Error de carga]`

Con la opción `[Venció antes]` se puede calcular cuántos días antes del `expiry_date` estimado venció de verdad, y usar eso para ajustar el modelo hacia abajo.

Con `[No lo usé a tiempo]` se descarta la muestra — el producto era válido, el problema fue conductual.

---

## 8. El problema del arranque en frío

El sistema no tiene datos cuando es nuevo. Estrategia de bootstrap en tres capas:

**Capa 1 — `freshness_rules` (día 0):**
Para frescos, las reglas ya definidas en el schema (hojas verdes → 2-5 días, pollo → 1-2 días) funcionan como sugerencia base desde el primer usuario. No se necesitan muestras.

**Capa 2 — Open Food Facts (día 0):**
La base pública tiene datos de shelf life para EANs de productos argentinos. Se importa como seed inicial con `confidence_level = 'baja'`. A medida que llegan muestras reales, el dato se reemplaza o refuerza.

**Capa 3 — datos propios (crece con el uso):**
Con 30 usuarios activos durante 2 semanas hay suficientes muestras de los productos más comunes para llegar a confianza `media` o `alta` en frescos frecuentes.

---

## 9. Schema: tablas adicionales

### Estadísticas por EAN

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

CREATE MATERIALIZED VIEW product_catalog_stats AS
WITH base AS (
  SELECT
    pi.catalog_product_id,
    pi.category_id,
    (pi.expiry_date - pi.added_at::date) AS vida_util_dias
  FROM pantry_items pi
  WHERE pi.catalog_product_id IS NOT NULL
    AND pi.product_type = 'envasado'
    AND pi.status IN ('activo', 'consumido')
    AND pi.expiry_date IS NOT NULL
    AND pi.expiry_date > pi.added_at::date
)
SELECT
  catalog_product_id,
  MODE() WITHIN GROUP (ORDER BY category_id)                  AS suggested_category_id,
  COUNT(*)                                                     AS sample_count,
  ROUND(AVG(vida_util_dias))                                  AS avg_shelf_life_days,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY vida_util_dias) AS median_shelf_life_days,
  ROUND(STDDEV(vida_util_dias))                               AS stddev_days,
  ROUND(
    STDDEV(vida_util_dias) /
    NULLIF(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY vida_util_dias), 0),
    2
  )                                                            AS cv,
  CASE
    WHEN COUNT(*) < 3                                          THEN 'sin_datos'
    WHEN STDDEV(vida_util_dias) /
         NULLIF(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY vida_util_dias), 0) > 0.5
                                                               THEN 'sin_datos'
    WHEN COUNT(*) >= 30                                        THEN 'alta'
    WHEN COUNT(*) >= 10                                        THEN 'media'
    ELSE 'baja'
  END AS confidence_level
FROM base
GROUP BY catalog_product_id;

CREATE UNIQUE INDEX ON product_catalog_stats(catalog_product_id);
```

### Estadísticas por nombre normalizado

```sql
CREATE MATERIALIZED VIEW product_name_stats AS
WITH base AS (
  SELECT
    lower(trim(unaccent(pi.name)))       AS normalized_name,
    pi.category_id,
    (pi.expiry_date - pi.added_at::date) AS vida_util_dias
  FROM pantry_items pi
  WHERE pi.status IN ('activo', 'consumido')
    AND pi.expiry_date IS NOT NULL
    AND pi.expiry_date > pi.added_at::date
)
SELECT
  normalized_name,
  MODE() WITHIN GROUP (ORDER BY category_id)                  AS suggested_category_id,
  COUNT(*)                                                     AS sample_count,
  ROUND(AVG(vida_util_dias))                                  AS avg_shelf_life_days,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY vida_util_dias) AS median_shelf_life_days,
  ROUND(STDDEV(vida_util_dias))                               AS stddev_days,
  ROUND(
    STDDEV(vida_util_dias) /
    NULLIF(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY vida_util_dias), 0),
    2
  )                                                            AS cv,
  CASE
    WHEN COUNT(*) < 3                                          THEN 'sin_datos'
    WHEN STDDEV(vida_util_dias) /
         NULLIF(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY vida_util_dias), 0) > 0.5
                                                               THEN 'sin_datos'
    WHEN COUNT(*) >= 30                                        THEN 'alta'
    WHEN COUNT(*) >= 10                                        THEN 'media'
    ELSE 'baja'
  END AS confidence_level
FROM base
GROUP BY normalized_name;

CREATE INDEX ON product_name_stats USING gin(normalized_name gin_trgm_ops);
```

### Feedback de sugerencias

```sql
CREATE TABLE suggestion_feedback (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pantry_item_id            uuid NOT NULL REFERENCES pantry_items(id) ON DELETE CASCADE,

  suggested_category_id     int  REFERENCES categories(id),
  suggested_shelf_life_days int,
  confidence_level          text,
  suggestion_source         text CHECK (
    suggestion_source IN ('catalog_stats', 'name_stats', 'freshness_rules', 'sin_datos')
  ),

  accepted                  boolean NOT NULL,
  final_category_id         int REFERENCES categories(id),
  final_expiry_date         date,

  -- Para el feedback loop al descartar
  discard_reason            text CHECK (
    discard_reason IN ('vencio_antes', 'no_lo_use', 'error_de_carga')
  ),

  created_at                timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE suggestion_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "usuarios ven solo su feedback"
  ON suggestion_feedback FOR ALL USING (user_id = auth.uid());
```

---

## 10. Query de sugerencia por nombre

Lo que ejecuta el backend cuando el usuario escribe el nombre de un producto:

```sql
SELECT
  pns.normalized_name,
  pns.suggested_category_id,
  c.label                          AS category_label,
  pns.median_shelf_life_days       AS suggested_days,
  pns.sample_count,
  pns.confidence_level,
  pns.cv,
  similarity(
    pns.normalized_name,
    lower(trim(unaccent(:nombre_ingresado)))
  )                                AS match_score
FROM product_name_stats pns
JOIN categories c ON c.id = pns.suggested_category_id
WHERE pns.normalized_name % lower(trim(unaccent(:nombre_ingresado)))
  AND pns.confidence_level != 'sin_datos'
ORDER BY match_score DESC, pns.sample_count DESC
LIMIT 3;
```

Devuelve hasta 3 candidatos rankeados por similitud textual y respaldados por datos suficientes. El frontend muestra el primero como sugerencia principal y los otros como alternativas.

---

## 11. Actualización de las vistas

Las vistas materializadas requieren refresh manual. Recomendado: **cron diario a las 3 AM** via `pg_cron` (disponible en Supabase):

```sql
SELECT cron.schedule(
  'refresh-product-stats',
  '0 3 * * *',
  $$
    REFRESH MATERIALIZED VIEW CONCURRENTLY product_catalog_stats;
    REFRESH MATERIALIZED VIEW CONCURRENTLY product_name_stats;
  $$
);
```

Las sugerencias no necesitan ser tiempo real. Un desfasaje de hasta 24 horas no impacta la experiencia.

---

## 12. Métricas de calidad del sistema

Con `suggestion_feedback` se puede medir si el sistema está funcionando:

```sql
-- Tasa de aceptación por nivel de confianza
SELECT
  confidence_level,
  COUNT(*)                             AS total,
  SUM(accepted::int)                   AS aceptadas,
  ROUND(AVG(accepted::int) * 100, 1)  AS pct_aceptacion
FROM suggestion_feedback
GROUP BY confidence_level
ORDER BY pct_aceptacion DESC;

-- Productos con mayor divergencia entre sugerencia y realidad
SELECT
  sf.suggested_shelf_life_days,
  AVG(sf.final_expiry_date - pi.added_at::date) AS dias_reales_promedio,
  COUNT(*)                                        AS casos
FROM suggestion_feedback sf
JOIN pantry_items pi ON pi.id = sf.pantry_item_id
WHERE sf.accepted = false
  AND sf.final_expiry_date IS NOT NULL
GROUP BY sf.suggested_shelf_life_days
ORDER BY ABS(
  sf.suggested_shelf_life_days -
  AVG(sf.final_expiry_date - pi.added_at::date)
) DESC;
```

Si `'alta'` tiene menos del 80% de aceptación, los umbrales necesitan revisión. Si `'baja'` tiene más del 60%, el umbral mínimo de muestras puede bajarse.

---

## 13. Lo que este sistema no hace (y no necesita)

- No predice comportamiento de compra futuro
- No personaliza por usuario (la mediana es global)
- No detecta patrones estacionales
- No usa embeddings ni vectores de texto

Todo eso es territorio de machine learning. Lo que sí hace — agregar muestras, calcular medianas, filtrar por coeficiente de variación, buscar por similitud textual — es estadística básica ejecutada directamente en PostgreSQL. Corre en la misma base de datos, sin servicios externos, sin costos adicionales, y es completamente auditable.
