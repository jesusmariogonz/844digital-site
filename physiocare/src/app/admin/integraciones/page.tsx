"use client";
import { FlagBadge, PageHead, type Flag } from "@/components/ui";

const INTEGRATIONS: [string, string, Flag, string][] = [
  ["Autenticación", "Supabase Auth u otra solución con contraseñas seguras, verificación de correo y MFA para el administrador.", "pendiente", "Hoy: cuentas ficticias en el navegador."],
  ["Base de datos", "PostgreSQL / Supabase con row-level security. Una tabla por entidad (citas, pacientes, servicios, contenido, preguntas).", "pendiente", "Hoy: localStorage."],
  ["Google Calendar", "OAuth de Google, Calendar API, sincronización bidireccional cuando sea viable, prevención de duplicados, zona America/Monterrey.", "pendiente", "Hoy: agenda local, sin conexión a Google."],
  ["Pagos", "Mercado Pago o Stripe (Checkout / Payment Links) con webhooks para confirmar pagos y reembolsos.", "pendiente", "Hoy: estados simulados."],
  ["WhatsApp Business API", "Plantillas aprobadas por Meta, recordatorios 24 h y mismo día, respuestas 1/2.", "config", "Hoy: botón flotante a wa.me y bitácora simulada."],
  ["Correo transaccional", "Resend, Postmark o similar para confirmaciones y recuperación de contraseña.", "pendiente", "Hoy: simulado."],
  ["Almacenamiento de medios", "Vercel Blob o Supabase Storage para fotos y videos de la consola.", "pendiente", "Hoy: archivos solo en el navegador."],
  ["Expediente clínico", "Cifrado, auditoría inmutable, consentimiento, roles y validación legal (LFPDPPP, NOM-004-SSA3-2012) antes de datos reales.", "proxima", "Hoy: expediente ficticio de ejemplo."],
  ["Antispam del foro", "Captcha (Turnstile/hCaptcha) y límite de envíos por IP.", "pendiente", "Hoy: sin protección (solo demo)."],
  ["SEO y analítica", "Metadatos, sitemap, schema de negocio local, Google Analytics.", "config", "Hoy: sitio marcado como no indexable."],
];

export default function Integraciones() {
  return (
    <>
      <PageHead title="Integraciones y arquitectura" sub="Qué es real en el prototipo y qué se conecta en la versión productiva. Ninguna integración externa está activa." />
      <div className="grid md:grid-cols-2 gap-4">
        {INTEGRATIONS.map(([t, d, f, now]) => (
          <div key={t} className="card p-5"><div className="flex justify-between items-start gap-2"><h3 className="font-display text-2xl font-extrabold uppercase leading-none">{t}</h3><FlagBadge flag={f} always /></div><p className="text-sm text-slate-600 mt-2">{d}</p><p className="text-xs font-bold text-brand mt-2">{now}</p></div>
        ))}
      </div>
      <section className="card-dark p-6 mt-6">
        <h2 className="font-display text-3xl font-extrabold uppercase text-amber">Seguridad y cumplimiento antes de datos reales</h2>
        <ul className="mt-3 grid md:grid-cols-2 gap-2 text-sm text-white/80 list-disc list-inside">
          <li>Autenticación robusta y MFA para el profesional.</li><li>Roles y permisos mínimos necesarios.</li>
          <li>Cifrado en tránsito y en reposo.</li><li>Bitácora de auditoría de accesos.</li>
          <li>Aviso de privacidad y consentimiento informado.</li><li>Conservación del expediente conforme a la NOM-004-SSA3-2012.</li>
          <li>Respaldos y plan de recuperación.</li><li>Validación con un especialista legal antes de producción.</li>
        </ul>
      </section>
    </>
  );
}
