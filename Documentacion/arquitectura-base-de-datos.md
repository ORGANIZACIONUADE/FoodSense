# Arquitectura tecnológica y de datos

## 1. Criterios

FoodSense utiliza una arquitectura acotada, adecuada para un MVP académico: PWA mobile-first, componentes reutilizables, persistencia relacional y servicios externos puntuales. No se presenta como una arquitectura de microservicios ni como una plataforma de IA.

## 2. Arquitectura general

```text
Usuario
  ↓
PWA / interfaz Next.js, React y TypeScript
  ↓
Lógica de aplicación y acceso a datos
  ↓
PostgreSQL / Supabase

Escaneo EAN ──→ Open Food Facts ──→ datos editables por el usuario
```

| Capa | Responsabilidad |
|---|---|
| PWA mobile-first | Navegación, formularios, cámara, dashboard, despensa y reportes |
| Aplicación | Reglas de vencimiento, prioridades, validación y operaciones de inventario |
| Persistencia | Usuarios, productos, fechas, estados e historial de eventos |
| Autenticación | Identificación del usuario y acceso a su inventario |
| Servicio externo | Consulta de productos por EAN mediante Open Food Facts |

## 3. Modelo vigente

La persistencia implementada se concentra en dos entidades de negocio.

### `products`

Representa los productos activos de la despensa.

| Campo lógico | Descripción |
|---|---|
| `id` | Identificador único |
| `user_id` | Propietario del registro |
| `name` | Nombre visible |
| `category` | Una de las ocho categorías del MVP |
| `state` | `cerrado`, `abierto` o `congelado` |
| `expiry_date` | Fecha informada o sugerida y confirmada |
| `quantity` | Cantidad opcional |

### `product_events`

Registra cierres relevantes del ciclo del producto, especialmente consumo o descarte, para alimentar métricas básicas.

```text
usuario 1 ─── N productos
usuario 1 ─── N eventos de producto
```

## 4. Reglas centrales

- El inventario se consulta por usuario y se ordena por fecha ascendente.
- Las categorías válidas son: lácteos, carnes, verduras, frutas, panificados, bebidas, huevos y conservas.
- Los estados válidos son: cerrado, abierto y congelado.
- La urgencia se calcula con los días restantes; no requiere un proceso programado para mostrarse actualizada.
- Consumir o descartar cierra el producto activo y genera la evidencia necesaria para reportes.
- Las sugerencias de fecha son editables y no constituyen una garantía de inocuidad.

## 5. Seguridad

- comunicación HTTPS en producción;
- autenticación antes de operar sobre datos personales;
- separación lógica del inventario por usuario;
- validación de entradas;
- variables sensibles fuera del repositorio;
- minimización de datos y uso agregado únicamente con transparencia y consentimiento.

## 6. Escalabilidad razonable

PostgreSQL permite índices por usuario, estado y fecha de vencimiento, suficientes para las consultas principales. La evolución puede incorporar caché del catálogo EAN, mayor cobertura de productos y procesos asíncronos cuando el volumen lo justifique. Esas optimizaciones no son necesarias para demostrar el MVP.

## 7. Fuera del alcance actual

Pertenecen al roadmap: OCR de tickets, almacenamiento de imágenes de compras, sesiones de compra masiva, hogar compartido, motor estadístico colaborativo, recetas, integración con supermercados e IA predictiva. Sus modelos de datos deben diseñarse cuando sus hipótesis hayan sido validadas, evitando anticipar complejidad innecesaria.
