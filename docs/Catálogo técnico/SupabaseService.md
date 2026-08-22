---
Nombre: "SupabaseService"
Tipo: "Servicio"
Área: "Global"
Feature: "Datos / Búsqueda"
Estado: "En revisión"
Ámbito: "Aplicación"
Fuente: "src/app/core/services/supabase.ts"
Entrada pública: "SupabaseService (providedIn: 'root')"
Resumen: "Cliente Supabase centralizado; expone searchArticulos(query) contra la RPC search_articulos_laxo. En revisión porque usa inyección por constructor (en vez de inject()) y no guarda el acceso con isPlatformBrowser, como exige la regla SSR/Supabase del proyecto."
Última modificación: "2026-08-22T12:00:00+02:00"
---

# SupabaseService

Después de descubrir esta pieza en el catálogo, consulta [su implementación](../../src/app/core/services/supabase.ts)
como fuente de verdad de su contrato detallado.
