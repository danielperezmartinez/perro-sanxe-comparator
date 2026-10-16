---
Nombre: "nearestProvince"
Tipo: "Utilidad"
Área: "Geolocalización"
Feature: "Selección de provincia"
Estado: "Vigente"
Ámbito: "Aplicación"
Fuente: "src/app/core/geo/nearest-province.ts"
Entrada pública: "nearestProvince(lat: number, lon: number): string | null"
Resumen: "Devuelve la provincia (con los nombres del select de la app) cuya capital está más cerca de unas coordenadas, o null si el punto está a más de 250 km de todas (fuera de España). Se calcula en el navegador para no enviar la ubicación a terceros; es aproximada cerca de las fronteras entre provincias. Función pura, sin dependencias."
Última modificación: "2026-10-17T01:50:00+02:00"
---

# nearestProvince

Después de descubrir esta pieza en el catálogo, consulta [su implementación](../../src/app/core/geo/nearest-province.ts)
como fuente de verdad de su contrato detallado. Sustituye a la geocodificación
inversa con Nominatim; ver
[[Tareas/Pedir la geolocalización con aviso y acción explícita]].
