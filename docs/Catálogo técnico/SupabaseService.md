---
Nombre: "SupabaseService"
Tipo: "Servicio"
Área: "Global"
Feature: "Datos / Búsqueda"
Estado: "Vigente"
Ámbito: "Aplicación"
Fuente: "src/app/core/services/supabase.ts"
Entrada pública: "SupabaseService (providedIn: 'root')"
Resumen: "Cliente Supabase centralizado; expone searchArticulos(query, signal?) contra la RPC search_articulos_laxo (FTS con prefijo AND + fallback trigrama para erratas). Acepta un AbortSignal opcional para cancelar la petición en vuelo. Usa inject() y crea el cliente solo en el navegador (isPlatformBrowser), conforme a la regla SSR/Supabase del proyecto."
Última modificación: "2026-08-23T14:05:00+02:00"
---

# SupabaseService

Después de descubrir esta pieza en el catálogo, consulta [su implementación](../../src/app/core/services/supabase.ts)
como fuente de verdad de su contrato detallado.
