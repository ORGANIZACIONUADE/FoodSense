# Documentación de FoodSense

Este directorio usa como fuente principal el [Informe Final Profesional](./FoodSense_Informe_Final_Profesional.docx). Los demás archivos amplían aspectos concretos y no deben interpretarse como alcances alternativos del producto.

## Estado documental

| Documento | Propósito | Estado |
|---|---|---|
| `FoodSense_Informe_Final_Profesional.docx` | Entregable académico integral | Fuente principal |
| `Estrategia_de_Negocio_FoodSense.docx` y `.pdf` | Modelo comercial, mercado, riesgos y go-to-market | Anexo; ambos formatos contienen el mismo documento |
| `Modelo_Financiero_FoodSense.xlsx` | Supuestos y escenarios económicos editables | Anexo cuantitativo |
| `arquitectura-base-de-datos.md` | Arquitectura y persistencia del MVP | Documento técnico vigente |
| `flujo-ingreso-productos.md` | Flujos actuales de alta y evolución futura | Documento funcional vigente |
| `motor-de-sugerencias.md` | Reglas actuales y evolución estadística | Documento funcional vigente |
| `Foodsens/` | Evidencia del proceso de diseño y handoff visual | Anexo histórico |
| `Archivo_historico/` | Planificación y artefactos de sprints | Evidencia histórica; no define el alcance actual |

## Convenciones comunes

- **MVP actual:** PWA mobile-first con autenticación, dashboard, despensa por urgencia, carga manual asistida, lectura de EAN con Open Food Facts, categorías, estados `cerrado`, `abierto` y `congelado`, alertas dentro de la experiencia, perfil y métricas básicas.
- **Roadmap:** OCR de tickets, carga masiva, hogar compartido, recetas, lista de compras, automatizaciones avanzadas, integraciones con supermercados e IA predictiva.
- Se usa siempre **congelado**, no “freezado”.
- Las fechas sugeridas son referencias editables; no reemplazan la fecha del fabricante ni una evaluación de seguridad alimentaria.
- Los porcentajes de validación describen una prueba acotada. La reducción real del desperdicio requiere medición longitudinal.
- Las proyecciones económicas son hipótesis y no resultados observados.

## Evitar duplicaciones

El informe concentra narrativa académica, resultados, mercado y conclusiones. Los Markdown contienen únicamente detalle funcional o técnico. La estrategia y la planilla financiera conservan el desarrollo comercial completo como anexos.
