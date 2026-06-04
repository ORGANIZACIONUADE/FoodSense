# Flujo de ingreso de productos

## Problema

El ingreso manual es el mayor punto de fricción de la app. Cargar productos uno a uno genera abandono. El objetivo es minimizar la intervención del usuario sin perder precisión.

## Distinción clave: frescos vs envasados

Son dos problemas distintos con dos objetivos distintos:

| | Frescos | Envasados |
|---|---|---|
| **Objetivo** | Usalo antes de que se pudra | No lo olvides en la alacena |
| **Fecha** | Estimada por estado actual | Exacta (impresa en el envase) |
| **Urgencia** | Alta, corto plazo | Baja, largo plazo |
| **Intervención del usuario** | Mínima | Necesaria para la fecha |

## Flujo completo

### Entrada: escaneo del ticket de compra

1. El usuario escanea el ticket con la cámara
2. OCR extrae los ítems
3. IA clasifica cada ítem como **fresco** o **envasado**
4. Los ítems se bifurcan en dos ramas

---

### Rama frescos

Por cada producto fresco detectado:

- Nombre y categoría inferidos por IA
- El usuario elige el estado con un scroll rápido:
  - 🟢 **Recién comprado** → fecha estimada larga
  - 🟡 **Tiene unos días** → fecha estimada media
  - 🔴 **Usalo ya** → fecha estimada corta
- Fecha calculada automáticamente según categoría + estado
- El producto se agrega a la despensa sin más preguntas

La fecha no pretende ser exacta — refleja la realidad del producto en ese momento. Es un recordatorio de urgencia, no una fecha de vencimiento precisa.

---

### Rama envasados

Modo cámara persistente, guiando producto por producto:

1. Pantalla muestra el ítem del ticket: *"Escaneá: Leche La Serenísima 1L"*
2. El usuario apunta la cámara al código EAN del producto
3. **EAN reconocido** → beep de confirmación ✓ → fecha del EAN o ingreso rápido → siguiente
4. **Sin EAN** → ingreso manual mínimo → siguiente
5. La cámara no se cierra hasta terminar la lista

El beep da feedback instantáneo y hace fluido el proceso (similar al scanner de caja del supermercado).

---

### Resultado

- Despensa actualizada con toda la compra de una sola vez
- Frescos con fecha estimada por estado
- Envasados con fecha exacta

## Tabla de variaciones para frescos

Los días sugeridos se calculan combinando **categoría + subcategoría + estado**:

```
verduras
  └── hojas verdes (lechuga, espinaca, rúcula, acelga) → 2-5 días
  └── raíces (zanahoria, papa, cebolla, ajo)           → 14-21 días
  └── frutos (tomate, pimiento, zapallo)               → 4-7 días

frutas
  └── cítricas (naranja, limón, mandarina)             → 7-14 días
  └── de estación (durazno, ciruela, higo)             → 2-4 días
  └── tropicales (banana, mango, ananá)                → 2-5 días

carnes
  └── res / cerdo                                      → 2-3 días
  └── pollo                                            → 1-2 días
  └── pescado                                          → 1-2 días
```

## Puntos pendientes de definición

- ¿Qué pasa si la IA no está segura de si un ítem es fresco o envasado? ¿Le pregunta al usuario?
- ¿El scroll de estado aplica solo al flujo de ticket o también al ingreso manual de frescos?
- ¿Qué base de datos de EAN se usa? Open Food Facts es la opción obvia pero tiene gaps en productos argentinos.
