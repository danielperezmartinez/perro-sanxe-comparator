---
Nombre: Completar reglas fundamentales de la bóveda
Estado: Hecha
Resumen: Definido el idioma de código/documentación y eliminado .gemini/GEMINI.md (duplicado del README.md, contenía además una URL de autorización OAuth de Supabase pegada por error).
Decisiones:
  - Documentación de la bóveda en español; código con identificadores/comentarios genéricos en inglés y vocabulario de dominio en español, siguiendo la convención ya presente en el código.
  - .gemini/GEMINI.md eliminado: su contenido estaba íntegramente migrado a docs/README.md y ningún agente lo lee como arranque (el GEMINI.md de la raíz ya es el puntero).
Bloqueada: []
Fecha de creación: 2026-08-22T12:00:00+02:00
Última modificación: 2026-08-22T18:30:00+02:00
---

# Completar reglas fundamentales de la bóveda

## Objetivo

Al montar la bóveda de memoria (`docs/`) se migraron a [[README|docs/README.md]]
las reglas ya escritas previamente en el `CLAUDE.md` de la raíz y en
`.gemini/GEMINI.md` (stack, patrones Angular/SSR, arquitectura de datos, lógica
de scraping, funcionalidades de frontend). Algunos puntos quedaron sin definir
y se marcaron con `<!-- TODO -->` en el apartado "Reglas fundamentales del
proyecto".

## Criterios de finalización

- Definir la política de idioma de código, identificadores y comentarios (hoy
  el esquema de datos usa nombres de dominio en español: `articulos`,
  `precios_historico`, `supermercado`; falta decidir si aplica también a
  identificadores de TypeScript/Angular y a la documentación técnica).
- Decidir qué hacer con `.gemini/GEMINI.md`: su contenido ya está migrado a
  `docs/README.md`, así que hoy es una copia duplicada de esas reglas. Opciones
  a valorar: convertirlo en puntero (como `CLAUDE.md`/`AGENTS.md`/`GEMINI.md`
  de la raíz) o eliminarlo si ninguna herramienta lo necesita en esa ruta.
- Revisar si el fichero `.gemini/GEMINI.md` contiene una URL de autorización
  OAuth pegada por error al final (detectada durante el montaje de la bóveda)
  y decidir si se elimina.
- Revisar si faltan otras reglas fundamentales no cubiertas por el contenido
  migrado.
- Quitar los marcadores `<!-- TODO -->` de `docs/README.md` una vez decidido
  cada punto.

## Verificación

- Releída `docs/README.md`: ya no quedan marcadores `<!-- TODO -->`.
- Comparado el contenido completo de `.gemini/GEMINI.md` (antes de borrarlo)
  contra `docs/README.md`: todas las reglas (stack, TS, Angular, accesibilidad,
  servicios, plantillas, patrones SSR/Supabase, arquitectura de datos,
  scraping, funcionalidades de frontend) estaban ya migradas; no se encontraron
  reglas fundamentales adicionales que faltase incorporar.
- Confirmado que `GEMINI.md` en la raíz del repo ya es un puntero a
  `docs/README.md` (idéntico en forma a `CLAUDE.md`/`AGENTS.md`), por lo que
  `.gemini/GEMINI.md` no era necesario en esa ruta para ninguna herramienta.
- Verificada y eliminada la URL de autorización OAuth de Supabase
  (`api.supabase.com/v1/oauth/authorize?...`) que estaba pegada al final de
  `.gemini/GEMINI.md`.

## Resultado

- **Idioma:** documentación de la bóveda en español; código con identificadores
  y comentarios genéricos en inglés (convención TS/Angular estándar, ya
  presente en el código); vocabulario de dominio en español cuando refleja el
  esquema de datos o el negocio (`Articulo`, `precio`, `provincia`, etc.).
  Documentado en `docs/README.md`, sección "4. Idioma de código y
  documentación".
- **`.gemini/GEMINI.md`:** eliminado. Su contenido era una copia duplicada de
  las reglas ya presentes en `docs/README.md`, no lo lee ninguna herramienta
  como fichero de arranque, y contenía una URL de autorización OAuth filtrada
  que no debía permanecer en el repositorio.
- No se identificaron reglas fundamentales adicionales pendientes de migrar.
