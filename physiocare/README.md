# Erik Fitness and Rehab — Consultorio digital (prototipo de demostración)

Prototipo comercial de **844 Digital** para un fisioterapeuta de Saltillo, Coahuila.
Presenta el concepto de un *consultorio digital*: sitio profesional + agenda de citas + portal del paciente + panel del fisioterapeuta + expediente digital (concepto) + pagos y notificaciones (simulados).

> **Todo es una demostración.** Los datos son ficticios, viven solo en el navegador (`localStorage`) y no se conecta ningún servicio externo. No se piden ni se guardan datos reales ni de tarjeta.

- **Stack:** Next.js (App Router) · React · TypeScript · Tailwind CSS v4. Sin dependencias adicionales.
- **Marca:** nombre y datos de contacto de ejemplo en `src/lib/seed.ts` (`BRAND`). Paleta en variables `@theme` de `src/app/globals.css`.
- **Zona horaria de la agenda:** `America/Monterrey` (Saltillo).

## Ejecutar

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # compilación de producción
npm run lint     # comprobación de tipos (tsc --noEmit)
```

## Rutas

| Ruta | Descripción |
|---|---|
| `/` · `/sobre-mi` · `/servicios` | Sitio público |
| `/aprende` | Biblioteca multimedia «Aprende y conoce» (videos de YouTube, Reels, consejos, novedades) |
| `/preguntas` | «Pregúntale a Erik»: foro **moderado**; cada respuesta lleva un botón para agendar |
| `/contacto` | Horarios, mapa, WhatsApp, Instagram, formulario |
| `/agendar` | Reservación en 6 pasos (servicio → fecha/hora → cuenta → datos → pago simulado → confirmación) |
| `/ingresar` · `/cuenta` | Acceso (demo / crear cuenta / recuperar) y portal del paciente |
| `/demo` | Guía de presentación con las dos experiencias y el estado de cada módulo |
| `/admin` | Panel de Erik: resumen, agenda, pacientes (+ expediente), servicios, consola de contenido, preguntas, pagos, notificaciones, integraciones |

## Accesos de demostración

En `/ingresar` (pestaña «Accesos de demostración»), claramente marcados:
- **Paciente demo:** Ana Ramírez (cuenta ficticia).
- **Fisioterapeuta demo:** Erik (administrador ficticio).

## Guion de la demo (2 pestañas)

1. Abre el panel de Erik en una pestaña (`/ingresar` → *Entrar como Erik*).
2. En otra pestaña, agenda una cita como paciente (`/agendar`). Paga el anticipo simulado.
3. Vuelve al panel: la cita ya aparece en la agenda, el resumen y la bitácora de notificaciones (las pestañas comparten datos).
4. Envía una pregunta en `/preguntas` y apruébala desde `/admin/preguntas`.
5. Pega un enlace de YouTube en `/admin/contenido` y mira cómo aparece en `/aprende`.
6. Abre un expediente ficticio (`/admin/pacientes/p_ana` → Expediente) y la bitácora de auditoría.

El botón «Restablecer datos de la demo» está en `/demo`.

## Funcionalidades simuladas (disponibles en la demo)

- Disponibilidad por servicio y duración, horarios ocupados y bloqueos; calendario diario/semanal/mensual.
- Reservación completa, alta manual, confirmación, cancelación y reprogramación (paciente y administrador).
- Estados de pago (anticipo, pagado, rechazado, reembolsado) con una pasarela **simulada**.
- Notificaciones (correo, WhatsApp, avisos internos) como **bitácora simulada** con plantillas.
- Foro con moderación previa, «A mí también me pasa» y sugerencia de servicio.
- Consola de contenido: subida de archivos (solo en el navegador), videos de YouTube con reproductor, publicaciones de Instagram, consejos y novedades; publicar/despublicar/destacar.
- Expediente digital ficticio, permisos por rol (diseño) y bitácora de auditoría.

## Integraciones pendientes (no activas)

| Integración | Estado | Notas |
|---|---|---|
| Autenticación real | Pendiente | Supabase Auth u otra; MFA para el administrador |
| Base de datos | Pendiente | PostgreSQL/Supabase con RLS |
| Google Calendar | Pendiente | OAuth, Calendar API, sincronización bidireccional, anti-duplicados, zona America/Monterrey |
| Pagos | Pendiente | Mercado Pago o Stripe con webhooks; nunca almacenar tarjetas |
| WhatsApp Business API | Requiere configuración | Cuenta verificada y plantillas aprobadas por Meta |
| Correo transaccional | Pendiente | Resend / Postmark |
| Almacenamiento de medios | Pendiente | Vercel Blob / Supabase Storage |
| Antispam del foro | Pendiente | Captcha y límites de envío |
| Expediente clínico real | Próxima implementación | Ver advertencia |

> **Expediente clínico:** no debe usarse con información real hasta resolver autenticación robusta, cifrado, auditoría, consentimiento, trazabilidad y cumplimiento (LFPDPPP y NOM-004-SSA3-2012). La arquitectura definitiva debe validarse antes.

## Contenido pendiente de Erik

Fotografías reales (hoy: fotos de stock de Unsplash), biografía, formación y certificaciones (campos editables, no se inventan), número de WhatsApp, teléfono, correo y dirección reales, testimonios reales con autorización y enlaces de YouTube.

## Despliegue en Vercel

- Proyecto de Vercel: `physiocare-844`, vinculado a este repositorio con **Root Directory = `physiocare`** y framework Next.js.
- Dominio: `physiocare.844digital.com` (agregado en Vercel). DNS en Cloudflare: registro **CNAME** `physiocare` → `cname.vercel-dns.com`, en modo **DNS only** (nube gris).
- Vercel despliega a producción desde `main`; las demás ramas generan *previews*.
- El sitio está marcado `noindex` mientras sea una demo.
- Sin variables de entorno requeridas.
