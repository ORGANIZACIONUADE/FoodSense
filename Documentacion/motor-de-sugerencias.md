# Motor de sugerencias

## Propósito

El motor reduce el trabajo de carga proponiendo categoría, estado y vencimiento. Toda sugerencia es visible, editable y confirmada por el usuario.

## Implementación del MVP

### Categoría por nombre

La carga manual compara el nombre ingresado con un diccionario local de palabras clave. El diccionario cubre ocho categorías:

| Categoría | Ejemplos |
|---|---|
| Lácteos | leche, queso, yogur, manteca |
| Carnes | carne, pollo, pescado, milanesa |
| Verduras | lechuga, tomate, cebolla, zanahoria |
| Frutas | manzana, banana, naranja, pera |
| Panificados | pan, galletita, factura, torta |
| Bebidas | agua, jugo, gaseosa, café |
| Huevos | huevo, maple, codorniz |
| Conservas | arroz, fideo, salsa, legumbres, aceite |

La comparación se realiza sin distinguir mayúsculas y admite plurales simples. Si no existe coincidencia, el sistema no debe presentar una clasificación como certeza: el usuario elige la categoría.

### Categoría por EAN

El escáner consulta las etiquetas de Open Food Facts y las traduce a las categorías del MVP. Los datos externos pueden estar incompletos o ser incorrectos, por lo que el resultado permanece editable. Ante ausencia de producto, se continúa con carga manual.

### Estado sugerido

Se propone un estado inicial por categoría entre `cerrado`, `abierto` y `congelado`. El usuario puede cambiarlo antes o después del alta.

### Vencimiento sugerido

El MVP combina categoría y estado para ofrecer una cantidad inicial de días. También dispone de atajos temporales. Esta fecha es una ayuda de carga, no reemplaza la fecha del envase ni una evaluación del alimento.

## Prioridad visual

La fecha confirmada se transforma en días restantes y alimenta la señal visual de urgencia. La aplicación prioriza productos próximos a vencer para facilitar una decisión cotidiana: qué consumir primero.

## Límites conocidos

- El diccionario puede no reconocer marcas, regionalismos o nombres ambiguos.
- Open Food Facts tiene cobertura variable en productos argentinos.
- Una misma categoría contiene productos con vidas útiles distintas.
- El estado declarado no permite inferir por sí solo la seguridad del alimento.
- La utilidad percibida del sistema no demuestra todavía reducción real del desperdicio.

## Evolución futura

Después de validar uso sostenido y contar con muestras suficientes, puede evaluarse un motor estadístico basado en datos agregados y anonimizados. Podría utilizar mediana, dispersión, detección de valores atípicos y niveles de confianza para mejorar sugerencias.

Ese motor, el OCR de fechas, la clasificación de tickets y la IA predictiva pertenecen al roadmap. No forman parte del MVP actual ni deben presentarse como capacidades implementadas.

## Métricas futuras de calidad

- porcentaje de categorías aceptadas sin corrección;
- porcentaje de fechas modificadas;
- cobertura de EAN;
- tasa de productos encontrados;
- tiempo promedio de alta;
- retención a siete días;
- proporción de alertas que terminan en consumo o descarte.
