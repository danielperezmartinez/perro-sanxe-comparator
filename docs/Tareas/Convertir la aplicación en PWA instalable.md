---
Nombre: Convertir la aplicación en PWA instalable
Estado: Hecha
Resumen: El frontend Angular SSR ya es una PWA instalable, con manifest, iconos propios y service worker que conserva la interfaz sin cachear respuestas dinámicas de precios.
Decisiones:
  - La caché PWA cubre únicamente la interfaz y los recursos estáticos; las consultas a Supabase permanecen orientadas a red para evitar precios obsoletos.
  - El service worker se registra solo en producción y después de que la aplicación se estabilice.
Bloqueada: []
Fecha de creación: 2026-08-23T20:18:39+02:00
Última modificación: 2026-08-23T20:23:43+02:00
---

# Convertir la aplicación en PWA instalable

## Objetivo

Permitir instalar Perro Sanxe Comparator desde navegadores compatibles y ofrecer
una carga básica de la interfaz con conectividad limitada, manteniendo siempre
frescos los resultados de precios obtenidos desde Supabase.

## Alcance

- Añadir el service worker oficial de Angular compatible con SSR.
- Crear el web app manifest con identidad, colores e iconos de la aplicación.
- Configurar una política de caché segura para recursos estáticos.
- Verificar tests y bundle de producción.

## Verificación

- `pnpm test -- --watch=false`: 5 ficheros y 12 pruebas superadas.
- `pnpm build`: compilación de navegador, servidor y prerender correcta; se
  mantiene el aviso preexistente del presupuesto inicial del bundle.
- El bundle contiene `ngsw.json`, `ngsw-worker.js`, manifest y los tres iconos.
- `ngsw.json` precarga `index.csr.html`, el fallback offline usado por Angular
  SSR, y no contiene grupos de caché de datos (`dataGroups: []`).
- Manifest, worker, configuración e iconos responden correctamente desde el
  servidor Express con sus tipos MIME esperados.

## Resultado

La aplicación puede instalarse desde navegadores compatibles. En producción,
el service worker se registra cuando la aplicación se estabiliza, mantiene
disponible la interfaz visitada y deja las consultas de precios orientadas a
red para evitar mostrar resultados obsoletos.
