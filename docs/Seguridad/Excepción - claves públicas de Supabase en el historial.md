---
Nombre: Excepción - claves públicas de Supabase en el historial
Tipo: Excepción
Estado: Vigente
Regla: "Nunca se suben secretos (revisión de fugas con gitleaks)."
Objeto: "src/environments/environment.ts · commits eea1768 (jwt) y c30fab6 (generic-api-key)"
Resumen: "gitleaks marca dos claves en el historial de environment.ts: la clave anon legacy (JWT con role=anon) y la clave publishable (sb_publishable_). Las dos son públicas por diseño, van en el cliente y la seguridad la da RLS. Se ignoran por su huella en .gitleaksignore; no hay nada que rotar."
Revisar antes de: 2027-04-17
Última modificación: 2026-10-17T14:30:00+02:00
---

# Excepción - claves públicas de Supabase en el historial

## Justificación

Revisión inicial del historial con gitleaks 8.30.1 (2026-10-17, solo lectura,
patrones genéricos y personales): solo aparecen estas dos coincidencias, ambas en
`src/environments/environment.ts`.

- `eea1768`, regla `jwt`: JWT del proyecto con `role=anon` (comprobado
  decodificando el payload, sin mostrar la clave).
- `c30fab6`, regla `generic-api-key`: clave `sb_publishable_` del proyecto.

Ninguna salta RLS. Como explica "Arquitectura objetivo" del README, la clave
publicable puede ir en el cliente; la secreta nunca. Mensajes de commit y nombres
de rama: sin coincidencias.

## Mitigaciones

- Las huellas exactas están en `.gitleaksignore`, con un comentario cada una. No
  se ignora la regla entera: cualquier otra clave en ese fichero sigue saltando.
- Una clave **secreta** nunca se añade a `.gitleaksignore`: se da por
  comprometida y se rota.
- Si se rotan las claves públicas, esta excepción sigue valiendo para las
  antiguas del historial.
