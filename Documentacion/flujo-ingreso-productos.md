# Flujo de ingreso de productos

## Alcance

Este documento detalla el alta de productos del MVP y separa explícitamente las automatizaciones futuras. La prioridad es reducir fricción sin ocultar al usuario el dato que finalmente se guardará.

## Flujo vigente del MVP

### Carga manual asistida

1. El usuario ingresa el nombre del producto.
2. El sistema intenta sugerir una de las ocho categorías: lácteos, carnes, verduras, frutas, panificados, bebidas, huevos o conservas.
3. Se propone un estado inicial entre `cerrado`, `abierto` y `congelado`.
4. Se sugiere una fecha según categoría y estado.
5. El usuario puede modificar categoría, estado y vencimiento antes de guardar.
6. El producto se incorpora a la despensa y queda ordenado por urgencia.

Las sugerencias reducen pasos, pero nunca sustituyen la decisión del usuario ni la fecha indicada por el fabricante.

### Escaneo de código de barras

1. El usuario habilita la cámara y apunta al código EAN.
2. La aplicación consulta Open Food Facts.
3. Si encuentra el producto, completa nombre y categoría como datos editables.
4. Si no lo encuentra, ofrece continuar mediante carga manual.
5. El usuario confirma estado y vencimiento antes de guardar.

La cobertura de productos argentinos puede ser incompleta; por eso el flujo siempre conserva una alternativa manual.

### Selector de vencimiento

El usuario puede elegir una fecha o utilizar atajos como hoy, tres días, una semana, dos semanas o un mes. La fecha se convierte en una prioridad visual dentro del dashboard y la despensa.

## Resultado del alta

Cada producto queda asociado, como mínimo, a:

- nombre;
- categoría;
- estado (`cerrado`, `abierto` o `congelado`);
- fecha de vencimiento o referencia estimada;
- cantidad, cuando corresponda.

## Funcionalidades relacionadas del MVP

- edición del producto;
- filtrado por categoría;
- marcado como consumido o descartado;
- alertas visuales según días restantes;
- métricas básicas de consumo y desperdicio.

## Evolución prevista, fuera del MVP

| Capacidad | Objetivo | Horizonte |
|---|---|---|
| OCR de tickets y carga por lote | Registrar una compra con menos trabajo manual | 6 a 12 meses |
| Guías post-apertura más precisas | Mejorar sugerencias por categoría y estado | 12 meses |
| Hogar compartido | Coordinar inventario entre convivientes | 12 meses |
| Recetas y lista de compras | Aumentar aprovechamiento y evitar duplicados | 12 meses |
| Integración con supermercados | Importar compras con consentimiento | 24 meses |
| IA predictiva | Anticipar patrones después de contar con evidencia suficiente | 24 meses |

El OCR, la clasificación mediante IA y la importación automática de tickets no forman parte del MVP documentado.
