---
Nombre: Checklist de lanzamiento
Tipo: Checklist
Estado: Pendiente
Resumen: Estado de la configuración fuera del código (gasto, Auth, firewall, secretos, plan, GitHub, legal y scraping) que ningún test del repo comprueba. Pendiente de la primera revisión en los paneles; los datos ya conocidos vienen de la auditoría de solo lectura del 2026-10-16.
Última revisión: 2026-10-17
Última modificación: 2026-10-17T14:30:00+02:00
---

# Checklist de lanzamiento

Marca cada punto al revisarlo en el panel y anota el valor real. Al terminar,
`Estado: Revisada` y actualiza `Última revisión`. Se revisa antes del primer
lanzamiento público, al cambiar de plan y, como mínimo, una vez por trimestre.

## Supabase (`wvzrilklvpaqzvehwyya`, "Perro sanxe Comparator", org devappsdpm)

- [ ] Plan actual y sus límites anotados (BD, Storage, egress, MAU). Plan
      **gratuito** según la auditoría. En el plan gratuito, superar un límite
      restringe **todo** el proyecto. No lo comparte con otras apps.
- [ ] Tope de gasto (Spend Cap) activado o, si se desactiva, decisión escrita.
- [ ] Alertas de uso o de facturación configuradas y con destinatario real.
- [ ] Auth: la app no usa cuentas (0 usuarios en la auditoría). Registro
      desactivado o, si queda abierto, decisión escrita; ningún proveedor
      activo que no se use; URLs de redirección limitadas a los dominios
      propios.
- [ ] Auth: confirmación de email, protección contra contraseñas filtradas,
      CAPTCHA y límites de envío de emails/OTP revisados (o Auth sin uso).
- [ ] Esquemas expuestos por la API: solo `public` y `graphql_public` (revisar
      si `graphql_public` hace falta).
- [ ] Copias de seguridad: lo que incluye el plan y si basta (el catálogo se
      puede regenerar con el scraper; el histórico de precios no).
- [x] Edge Function `scraper` (demo retirada) borrada: la auditoría del
      2026-10-16 no encontró Edge Functions desplegadas.
- [ ] Historial de migraciones del remoto alineado con `supabase/migrations/`
      (`supabase migration repair`) antes de usar `supabase db push`.

## Vercel (`perro-sanxe-comparator`)

- [ ] Plan adecuado al uso (Hobby no admite uso comercial).
- [ ] Spend Management: tope y alertas configurados, y acción al superarlo.
- [ ] Firewall: reglas de límite de peticiones en rutas públicas.
- [ ] Deployment Protection en Preview si las previews no deben ser públicas.
- [ ] Variables secretas solo en los entornos que las usan y marcadas como
      sensibles (la app solo necesita la clave publicable).
- [ ] Cabeceras de seguridad servidas (CSP, `X-Content-Type-Options`,
      `Referrer-Policy`, `Permissions-Policy`); ver
      [[Tareas/Endurecer el workflow de Actions y añadir cabeceras de seguridad en Vercel]].

## GitHub (`danielperezmartinez/perro-sanxe-comparator`)

- [ ] Secretos `SUPABASE_URL` y `SUPABASE_SECRET_KEY` solo como secretos de
      Actions; `SUPABASE_SERVICE_ROLE_KEY` legacy retirado si ya no se usa.
- [ ] Permisos por defecto de `GITHUB_TOKEN` en solo lectura.
- [ ] Jobs `rls`, `a11y` y `fugas` de `seguridad.yml` marcados como
      obligatorios en la protección de `main` **cuando estén en verde**.
- [x] Visibilidad del repo conocida: **público** (comprobado el 2026-10-17), así
      que aplica "Vulnerabilidades y hallazgos sensibles".
- [ ] Secret scanning activado.
- [ ] Push protection activado (bloquea en el servidor los pushes con secretos
      conocidos).
- [ ] Private vulnerability reporting activado.
- [ ] Hooks activos en cada clon de trabajo (`git config core.hooksPath`
      apunta a `.githooks`, lo hace `pnpm install`) y gitleaks instalado;
      fichero de patrones personales creado fuera del repo. Hecho en el clon
      principal del PC de desarrollo (2026-10-17); repetir en cada clon nuevo.
- [ ] Alertas de Dependabot activadas (las actualizaciones de acciones ya están
      en `.github/dependabot.yml`).

## Legal y privacidad

> No es asesoramiento legal; ante dudas concretas, consulta a un profesional.

- [ ] Aviso legal (LSSI-CE) y política de privacidad (RGPD) publicados y
      enlazados desde la página. Hechos en el código (`/aviso-legal`,
      `/privacidad`); falta comprobarlos en producción tras desplegar.
- [x] Terceros que reciben datos listados en la política, con región:
      Vercel (EE. UU.), Supabase (UE, Irlanda) y Google Fonts (EE. UU.). Ya no
      se usa Nominatim: la ubicación se resuelve en el navegador.
- [ ] Revisión de los textos legales por un profesional (opcional, recomendado).
- [ ] Banner de cookies solo si hay cookies no técnicas. Hoy solo hay
      `localStorage` técnico (provincia elegida), sin analítica.

## Scraping

> No es asesoramiento legal.

- [x] `robots.txt` de cada súper ingestado revisado y respetado (2026-10-17):
      Mercadona y Consum prohíben `/api` y quedan pausados; Dia no bloquea
      `/api/v1/plp-back` y sigue activo.
- [ ] Términos de uso de cada súper revisados (scraping, reutilización de
      datos, derecho sui generis de bases de datos de la UE); ver
      [[Tareas/Pedir permiso a Mercadona y Consum o buscar una fuente autorizada]].
- [x] User-agent veraz e identificable, con contacto
      (`PerroSanxeComparator/<versión>` + URL del repo); sin rotación.
- [x] 1 s mínimo entre peticiones al mismo host, caché por ejecución y
      reintentos con tope en `scraping/src/http.ts`.
- [x] Ninguna ingesta evade protecciones anti-bot: Carrefour pausado y las
      tareas de Alimerka, Coviran, El Corte Inglés, Alcampo y BonPreu archivadas.
- [ ] Frecuencia del cron (`scrape.yml`, diario) proporcionada al uso.

## Accesibilidad

- [ ] Revisión manual con teclado y lector de pantalla del flujo principal
      (buscar, cambiar provincia, "Usar mi ubicación", recorrer resultados y
      páginas legales).

## Revisiones

| Fecha | Quién | Notas |
| --- | --- | --- |
| 2026-10-16 | Agente (auditoría de solo lectura) | Checklist creada. Plan gratuito, proyecto no compartido, 0 usuarios de Auth, sin Edge Functions activas ni jobs de `pg_cron`. Los puntos de panel siguen sin revisar. |
| 2026-10-17 | Agente (rama `chore/sistema-seguridad`) | Scraping y terceros de privacidad marcados tras los arreglos. Los puntos de Supabase, Vercel y GitHub siguen sin revisar en los paneles; la migración de endurecimiento está pendiente de aplicar en remoto. |
| 2026-10-17 | Agente (sincronización a v2) | Sección GitHub ampliada. Revisión inicial con gitleaks 8.30.1 (genéricos y personales): historial, mensajes y ramas sin fugas, salvo las dos claves públicas de Supabase, documentadas en [[Excepción - claves públicas de Supabase en el historial]]. |
