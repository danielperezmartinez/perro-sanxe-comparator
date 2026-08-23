---
Nombre: "Ingesta de precios (scraping)"
Tipo: "Utilidad"
Área: "Datos / Ingesta"
Feature: "Recolección de precios"
Estado: "Vigente"
Ámbito: "Aplicación"
Fuente: "scraping/"
Entrada pública: "scraping/src/run.ts (orquestador) · SuperIngester (scraping/src/supers/types.ts) · SupabaseWriter (scraping/src/sink/supabase-writer.ts)"
Resumen: "Herramienta Node (TS nativo en Node >=24) que recolecta catálogo y precios desde las APIs JSON internas de los supers y los escribe en Supabase con service_role aplicando la regla de oro. Cada super implementa el contrato SuperIngester (async generator de NormalizedArticulo). Mercadona y Consum implementados; Carrefour pendiente (403 anti-bot). Ejecutado por CRON en GitHub Actions. Independiente del build de Angular."
Última modificación: "2026-08-22T21:45:00+02:00"
---

# Ingesta de precios (scraping)

Subsistema de recolección de datos, separado del frontend Angular. Para añadir un
supermercado nuevo, implementar el contrato `SuperIngester`
([scraping/src/supers/types.ts](../../scraping/src/supers/types.ts)) y registrarlo
en el orquestador ([scraping/src/run.ts](../../scraping/src/run.ts)); la escritura
con la regla de oro ya la resuelve `SupabaseWriter`
([scraping/src/sink/supabase-writer.ts](../../scraping/src/sink/supabase-writer.ts)).

Documentación operativa completa (uso, flags, puesta en marcha, estado por super)
en [scraping/README.md](../../scraping/README.md). Trabajo asociado:
[[Implementar la ingesta real de precios (Mercadona, Consum, Carrefour)]].
