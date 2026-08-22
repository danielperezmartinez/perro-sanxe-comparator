---
Nombre: "ResultRow"
Tipo: "Componente"
Área: "Compartido"
Feature: "UI reutilizable"
Estado: "Vigente"
Ámbito: "Aplicación"
Fuente: "src/app/shared/components/result-row/result-row.ts"
Entrada pública: "ResultRow (selector: app-result-row) — input 'item: ArticuloResult', input 'last', input 'isBest'"
Resumen: "Fila de resultado presentacional con la estética del tique (ver docs/Decisiones visuales/Anatomía del componente tique): nombre, supermercado, categoría, precio y precio/unidad con los pipes currency/date en locale es-ES. Ya no renderiza imagen del artículo (decisión visual aceptada). El input 'last' controla el borde separador discontinuo cuando se usa dentro de una lista; 'isBest' (nuevo) muestra el sello dibujado a mano 'MÁS BARATO' y colorea la píldora de precio/unidad en verde azulado. No inyecta servicios."
Última modificación: "2026-08-22T23:00:00+02:00"
---

# ResultRow

Después de descubrir esta pieza en el catálogo, consulta [su implementación](../../src/app/shared/components/result-row/result-row.ts)
como fuente de verdad de su contrato detallado.
