# Catálogo técnico

Este sistema permite descubrir la superficie reutilizable de PerroSanxeComparator
antes de buscar por todo el repositorio o crear una implementación nueva. Cada
fila enlaza con su nota estructurada; después de localizar una candidata se abre
su implementación, que continúa siendo la fuente de verdad técnica.

[[Catálogo técnico/Catálogo técnico.base|Abrir la vista completa del catálogo]]

## Cómo utilizarlo

1. Filtrar la vista por tipo, área, feature o estado.
2. Evitar las piezas `En revisión` salvo que el trabajo incluya estabilizarlas.
3. Abrir la fuente antes de depender de los detalles del contrato o
   modificarla.
4. Añadir o actualizar la entrada en el mismo cambio que altere una superficie
   reutilizable.

## Vocabularios de este proyecto

- `Tipo` ∈ `Componente` · `Servicio` · `Fachada` · `Directiva` · `Utilidad` ·
  `Primitiva CSS` · `Token` · `Guard`.
- `Área` y `Feature` son libres por ahora (proyecto en fase temprana); si el
  catálogo crece, definir una taxonomía cerrada aquí.
- `Ámbito` ∈ `Aplicación` · `Feature` · `Shell`.

## Política de evolución

- Se amplía una pieza existente cuando el nuevo caso conserva su
  responsabilidad y un contrato claro.
- Se crea una pieza nueva solo cuando representa un patrón estable diferente y
  se registra en el catálogo en el mismo cambio.
- Las adaptaciones de datos de dominio se realizan en el consumidor; las
  primitivas compartidas no conocen modelos de un área.
