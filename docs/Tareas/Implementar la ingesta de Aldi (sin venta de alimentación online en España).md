---
Nombre: Implementar la ingesta de Aldi (sin venta de alimentación online en España)
Estado: Planificando
Resumen: Aldi España no vende alimentación online: aldi.es es un sitio Next.js de folletos/ofertas. Su __NEXT_DATA__ menciona "price"/"product" pero sin símbolo € ni precio por unidad ni un catálogo comprable con PVP estable. Objetivo: reevaluar si en el futuro Aldi abre tienda online o si su app/folletos permiten extraer precios utilizables; hoy no hay fuente viable.
Bloqueada: []
Fecha de creación: 2026-08-23T18:30:00+02:00
Última modificación: 2026-08-23T18:30:00+02:00
---

# Implementar la ingesta de Aldi (sin venta de alimentación online en España)

Parte del estudio [[Ampliar el scraping con más supermercados de API pública (estudio Dia, Lidl, Alcampo, etc)]].

## Hallazgos del recon (2026-08-23)

- `https://www.aldi.es/` → Next.js (`__NEXT_DATA__`, buildId). Sin anti-bot.
- El `__NEXT_DATA__` (~105 KB) menciona "price"/"product" pero **sin `€`** y **sin campo de precio/unidad**; es contenido de folletos/ofertas, no un catálogo comprable.
- Aldi ES no ofrece ecommerce de alimentación a domicilio.

## Posible workaround (para cuando se aborde)

1. Extraer precios de **folletos/ofertas** desde el `__NEXT_DATA__` (dato parcial, promocional, sin precio/unidad) — utilidad muy limitada para el comparador.
2. Investigar la **app móvil** de Aldi por si expone catálogo con precios.
3. Reevaluar si Aldi lanza tienda online en España en el futuro.

## Decisión actual

Sin fuente de precios de super utilizable hoy. Prioridad muy baja (probablemente no viable hasta que Aldi tenga ecommerce).
