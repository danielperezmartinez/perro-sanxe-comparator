---
Nombre: Diseñar el área de finanzas personales
Estado: Planificando
Resumen: Definir, antes de implementar, la experiencia responsive y el modelo de datos Supabase del área de finanzas personales a partir del análisis de 07 JULIO.xlsx. Incluye autenticación y aislamiento por usuario; excluye cualquier lógica de pareja.
Decisiones:
  - Mantener la identidad Tique de Barrio, extendiéndola a una libreta de caja para la superficie financiera más densa.
  - Presentar y validar primero el diseño visual de escritorio y móvil; después cerrar el esquema de tablas y el plan por fases.
  - No persistir totales mensuales: se calculan a partir de movimientos, reglas recurrentes, periodos y objetivos.
  - Todas las entidades financieras llevan user_id y RLS; anon no obtiene acceso.
Bloqueada: []
Fecha de creación: 2026-09-04T10:57:37+02:00
Última modificación: 2026-09-04T11:07:55+02:00
---

# Diseñar el área de finanzas personales

## Contexto

Continúa [[Analizar la hoja de gastos 07 JULIO para el área de finanzas]]. El
objetivo es convertir los ámbitos útiles de la hoja en una experiencia para un
solo usuario, integrada con la aplicación y protegida mediante Supabase Auth y
RLS.

## Alcance de esta fase

1. Propuesta visual responsive para escritorio y móvil.
2. Inventario de pantallas, componentes y flujos.
3. Diseño lógico de tablas, relaciones, restricciones, índices y políticas RLS.
4. Orden de implementación y criterios de verificación.

No incluye todavía cambios en el frontend ni migraciones de base de datos.

## Estado

Propuesta preparada y pendiente de validación del usuario.

## Propuesta visual

Ver [[Extensión visual para el área de finanzas]]. Se han preparado mockups de
escritorio y móvil fuera del código de producción. La comparación conserva su
tique estrecho; finanzas utiliza una libreta de caja responsive.

## Modelo de datos propuesto

### `perfiles`

Extensión uno-a-uno de `auth.users`: nombre visible, moneda, zona horaria y
preferencias globales. Su clave primaria es también `user_id`.

### `cuentas_financieras`

Cuentas opcionales del usuario (principal, efectivo, ahorro, inversión) para
clasificar el origen o destino de los movimientos. Guarda saldo inicial y fecha
de ese saldo; el saldo actual siempre se calcula.

### `categorias_financieras`

Categorías personalizables por usuario y tipo de flujo: ingreso, gasto, ahorro o
inversión. Incluye orden e indicador de archivo, sin borrar historia.

### `periodos_financieros`

Un registro por usuario y mes. Guarda el primer día del mes, saldo inicial
planificado, estado abierto/cerrado y notas. Los agregados no se persisten.

### `reglas_recurrentes`

Plantillas para ingresos y gastos fijos: concepto, importe por cargo,
periodicidad en meses (1, 3, 6 o 12), próxima fecha, fecha de inicio/fin,
cuenta/categoría y estado activo. El equivalente mensual se calcula como
`importe / periodicidad_meses`.

### `objetivos_financieros`

Objetivos de ahorro, inversión o pago: importe objetivo, fechas, estado y
prioridad. El progreso se calcula desde movimientos enlazados.

### `movimientos_financieros`

Fuente de verdad operativa. Unifica ingresos, gastos, ahorro e inversión con
importe previsto y real, fecha prevista y real, estado, cuenta, categoría,
objetivo y regla recurrente opcionales. Permite representar previsión y realidad
sin duplicar tablas por cada tipo de movimiento.

## Columnas propuestas

### `perfiles`

| Columna | Tipo | Regla |
|---|---|---|
| `user_id` | `uuid` | PK y FK a `auth.users(id)` con borrado en cascada |
| `nombre_visible` | `text` | Opcional |
| `moneda` | `text` | `EUR` por defecto; código de 3 caracteres |
| `zona_horaria` | `text` | `Europe/Madrid` por defecto |
| `provincia_preferida` | `text` | Opcional; permite sincronizar la preferencia actual |
| `created_at`, `updated_at` | `timestamptz` | Auditoría |

### `cuentas_financieras`

| Columna | Tipo | Regla |
|---|---|---|
| `id` | `bigint identity` | PK |
| `user_id` | `uuid` | Propietario |
| `nombre` | `text` | Único por usuario entre cuentas activas |
| `tipo` | `text` | `corriente`, `efectivo`, `ahorro`, `inversion`, `otro` |
| `saldo_inicial` | `numeric(14,2)` | Puede ser negativo |
| `fecha_saldo_inicial` | `date` | Base para calcular el saldo |
| `archivada` | `boolean` | `false` por defecto |
| `created_at`, `updated_at` | `timestamptz` | Auditoría |

### `categorias_financieras`

| Columna | Tipo | Regla |
|---|---|---|
| `id` | `bigint identity` | PK |
| `user_id` | `uuid` | Propietario |
| `nombre` | `text` | Único por usuario y tipo entre categorías activas |
| `tipo_movimiento` | `text` | `ingreso`, `gasto`, `ahorro`, `inversion` |
| `icono` | `text` | Clave visual opcional, no SVG arbitrario |
| `orden` | `smallint` | Orden de presentación |
| `archivada` | `boolean` | Conserva la historia |
| `created_at`, `updated_at` | `timestamptz` | Auditoría |

### `periodos_financieros`

| Columna | Tipo | Regla |
|---|---|---|
| `id` | `bigint identity` | PK |
| `user_id` | `uuid` | Propietario |
| `mes` | `date` | Siempre el primer día del mes; único por usuario |
| `saldo_inicial_planificado` | `numeric(14,2)` | Remanente o base mensual |
| `estado` | `text` | `abierto` o `cerrado` |
| `cerrado_at` | `timestamptz` | Solo al cerrar el periodo |
| `notas` | `text` | Opcional |
| `created_at`, `updated_at` | `timestamptz` | Auditoría |

### `reglas_recurrentes`

| Columna | Tipo | Regla |
|---|---|---|
| `id` | `bigint identity` | PK |
| `user_id` | `uuid` | Propietario |
| `cuenta_id`, `categoria_id` | `bigint` | FKs opcionales del mismo usuario |
| `tipo_movimiento` | `text` | `ingreso`, `gasto`, `ahorro`, `inversion` |
| `concepto` | `text` | Obligatorio |
| `importe` | `numeric(14,2)` | Mayor que cero |
| `periodicidad_meses` | `smallint` | 1, 3, 6 o 12 |
| `fecha_inicio`, `fecha_fin` | `date` | Fin opcional y no anterior al inicio |
| `proxima_fecha` | `date` | Próxima previsión a generar |
| `generacion_automatica` | `boolean` | Pendiente de decisión funcional |
| `activa` | `boolean` | `true` por defecto |
| `created_at`, `updated_at` | `timestamptz` | Auditoría |

### `objetivos_financieros`

| Columna | Tipo | Regla |
|---|---|---|
| `id` | `bigint identity` | PK |
| `user_id` | `uuid` | Propietario |
| `cuenta_id` | `bigint` | Destino opcional del ahorro |
| `nombre` | `text` | Obligatorio |
| `tipo` | `text` | `ahorro`, `inversion`, `pago`, `otro` |
| `importe_objetivo` | `numeric(14,2)` | Mayor que cero |
| `fecha_inicio`, `fecha_objetivo` | `date` | Fecha objetivo opcional |
| `estado` | `text` | `activo`, `pausado`, `completado`, `cancelado` |
| `prioridad` | `smallint` | Orden entre objetivos activos |
| `created_at`, `updated_at` | `timestamptz` | Auditoría |

### `movimientos_financieros`

| Columna | Tipo | Regla |
|---|---|---|
| `id` | `bigint identity` | PK |
| `user_id`, `periodo_id` | `uuid`, `bigint` | Propietario y mes presupuestario |
| `cuenta_id`, `categoria_id` | `bigint` | Clasificación opcional |
| `objetivo_id`, `regla_recurrente_id` | `bigint` | Origen/objetivo opcionales |
| `tipo` | `text` | `ingreso`, `gasto`, `ahorro`, `inversion` |
| `concepto` | `text` | Obligatorio |
| `importe_previsto`, `importe_real` | `numeric(14,2)` | Al menos uno informado; nunca negativos |
| `fecha_prevista`, `fecha_real` | `date` | El completado exige fecha e importe reales |
| `estado` | `text` | `previsto`, `pendiente`, `completado`, `cancelado` |
| `notas` | `text` | Opcional |
| `created_at`, `updated_at` | `timestamptz` | Auditoría |

La vista `resumen_financiero_mensual`, con `security_invoker = true`, puede
agrupar los movimientos por periodo y devolver previsto, real, disponible,
gastos, ahorro y saldos sin persistir cifras derivadas.

## Integridad y seguridad previstas

- Claves `bigint generated always as identity` para entidades; `user_id uuid`
  referencia `auth.users(id) on delete cascade`.
- Importes `numeric(14,2)`, fechas `date` y auditoría `timestamptz`.
- Restricciones `check` para importes no negativos, tipos, estados y
  periodicidades; unicidad de periodo y nombres de cuenta/categoría por usuario.
- Claves foráneas compuestas `(user_id, entidad_id)` para impedir enlaces entre
  datos de usuarios distintos.
- Índices principales: movimientos por `(user_id, fecha_real desc)`, previsiones
  por `(user_id, estado, fecha_prevista)`, recurrentes por
  `(user_id, activo, proxima_fecha)` y objetivos por
  `(user_id, estado, fecha_objetivo)`.
- RLS habilitado en todas las tablas. Políticas CRUD exclusivamente para
  `authenticated` con `(select auth.uid()) = user_id`; ningún permiso financiero
  para `anon`.
- Cualquier vista de resumen debe usar `security_invoker = true`; no se necesita
  `service_role` en el cliente.

## Plan de implementación propuesto

1. Validar mockups, alcance MVP y decisiones abiertas.
2. Añadir Supabase Auth y carcasa de navegación con rutas lazy.
3. Crear migración de tablas, restricciones, índices, RLS y datos iniciales.
4. Generar tipos TypeScript y ampliar el servicio Supabase por dominio.
5. Implementar Resumen con selector de mes y cálculos reactivos.
6. Implementar CRUD de movimientos y reglas recurrentes.
7. Implementar objetivos y progreso enlazado a movimientos.
8. Añadir historial, estados vacíos/error, pruebas Vitest, AXE y verificación SSR.

## Decisiones pendientes del usuario

- Incluir cuentas financieras en el MVP o empezar con una única cuenta implícita.
- Método de acceso: enlace mágico por correo o correo y contraseña.
- Crear automáticamente movimientos previstos desde las reglas recurrentes o
  hacerlo bajo confirmación mensual.
- Permitir varios objetivos simultáneos desde el MVP.
