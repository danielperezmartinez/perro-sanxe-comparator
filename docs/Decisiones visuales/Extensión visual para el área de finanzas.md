---
Número: 5
Estado: Propuesta
Ámbito: Layout
Resumen: Extender la identidad Tique de Barrio al área privada de finanzas mediante una libreta de caja ancha en escritorio y un tique continuo apilado en móvil, dentro de una nueva navegación global responsive.
Decisión: |
  Propuesta pendiente de validación del usuario:

  - El tique de comparación existente conserva íntegramente su ancho máximo de
    380 px y su composición actual.
  - Las finanzas usan otra superficie de la misma familia visual: una "libreta
    de caja" de papel con textura y perforado, preparada para información más
    densa. En escritorio puede alcanzar aproximadamente 1130 px.
  - Escritorio incorpora una barra lateral de marca y navegación con tres
    destinos: comparar, finanzas e historial. La libreta ocupa el área de
    trabajo restante.
  - Móvil sustituye la barra lateral por cabecera compacta y navegación inferior
    fija. La libreta pasa a una única columna; sus bloques se apilan y el CTA de
    alta de movimiento se convierte en botón flotante circular.
  - El resumen muestra saldo previsto como dato principal y disponible, gastos
    y ahorro como secundarios. Debajo aparecen movimientos recientes, próximos
    cargos y progreso del objetivo principal.
  - La sección se organiza en Resumen, Movimientos, Recurrentes y Objetivos.
  - Se reutilizan Luckiest Guy, Space Mono y los tokens accesibles de la paleta
    Videoclub. Se propone añadir un rojo apagado para salidas/alertas, siempre
    sujeto a verificación WCAG AA antes de aceptarlo.
Consecuencias: |
  - Requiere convertir App en una carcasa con rutas lazy y navegación responsive,
    preservando el componente tique estrecho para la comparación de precios.
  - Introduce componentes presentacionales nuevos para resumen, movimientos,
    próximos cargos, objetivos, selector de mes y navegación.
  - La propuesta no se considera decisión aceptada hasta que el usuario valide
    los mockups de escritorio y móvil.
Fecha de creación: 2026-09-04T11:05:50+02:00
Última modificación: 2026-09-04T11:05:50+02:00
---

# Extensión visual para el área de finanzas

## Contexto

El tique de comparación está diseñado como un recibo estrecho y no debe
ensancharse. El área de finanzas necesita comparar cifras, movimientos,
vencimientos y objetivos en una misma vista. La propuesta crea una superficie
hermana con más anchura sin romper [[Estrategia responsive del tique]].

## Estado

Propuesta visual presentada durante [[Diseñar el área de finanzas personales]].
Pendiente de validación o ajustes por parte del usuario.
