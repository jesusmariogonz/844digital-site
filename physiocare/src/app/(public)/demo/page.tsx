"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { FlagBadge, type Flag } from "@/components/ui";
import { SectionHead } from "@/components/cards";

const MODULES: [string, string, Flag, string][] = [
  ["Sitio profesional", "Diseño, servicios, multimedia", "demo", "SEO y contenido real"],
  ["Agenda y reservaciones", "Disponibilidad, calendario, citas", "demo", "Google Calendar real"],
  ["Portal del paciente", "Cuenta, citas, pagos, documentos", "demo", "Autenticación real"],
  ["Pregúntale a Erik", "Foro moderado con CTA a agendar", "demo", "Base de datos y antispam"],
  ["Pagos digitales", "Estados y flujo simulados", "pendiente", "Mercado Pago / Stripe"],
  ["Expediente clínico", "Concepto con datos ficticios", "proxima", "Implementación segura (NOM-004)"],
  ["WhatsApp y correo", "Plantillas y bitácora simulada", "pendiente", "WhatsApp Business API"],
  ["Consola de contenido", "Subida de medios, videos, novedades", "demo", "Almacenamiento permanente"],
];

export default function Demo() {
  const router = useRouter();
  const { loginAs, resetDemo } = useStore();
  return (
    <div className="container-x pt-14">
      <SectionHead h1 eyebrow="Presentación comercial" title="Recorre la plataforma">
        Dos experiencias de principio a fin. Todo usa datos ficticios guardados solo en este navegador.
      </SectionHead>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-7">
          <span className="chip bg-amber text-ink">Experiencia 1</span>
          <h2 className="font-display text-4xl font-extrabold uppercase mt-3">Paciente</h2>
          <ol className="mt-4 space-y-2 text-slate-700 list-decimal list-inside">
            <li>Entra al sitio y conoce los servicios.</li>
            <li>Consulta disponibilidad y agenda una cita.</li>
            <li>Paga un anticipo (simulado).</li>
            <li>Revisa su perfil, próximas citas y pagos.</li>
          </ol>
          <div className="mt-6 flex gap-2 flex-wrap"><Link href="/servicios" className="btn btn-primary">Empezar por servicios</Link><button className="btn btn-outline" onClick={() => { loginAs("patient", "p_ana"); router.push("/cuenta"); }}>Entrar como Ana (demo)</button></div>
        </div>
        <div className="card-dark p-7">
          <span className="chip bg-amber text-ink">Experiencia 2</span>
          <h2 className="font-display text-4xl font-extrabold uppercase mt-3">Fisioterapeuta</h2>
          <ol className="mt-4 space-y-2 text-white/80 list-decimal list-inside">
            <li>Accede al panel y ve la cita recién agendada.</li>
            <li>Consulta la agenda diaria, semanal y mensual.</li>
            <li>Revisa pacientes y un expediente ficticio.</li>
            <li>Modera preguntas y sube contenido en su consola.</li>
          </ol>
          <div className="mt-6"><button className="btn btn-primary" onClick={() => { loginAs("admin"); router.push("/admin"); }}>Entrar como Erik (demo)</button></div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-brand/10 border border-brand/20 p-5 text-sm">
        <b>Tip para la presentación:</b> abre el panel de Erik en una pestaña y el sitio en otra. Al agendar como paciente, la cita aparece en el panel al instante (ambas pestañas comparten los datos de la demo).
      </div>

      <h2 className="font-display text-4xl font-extrabold uppercase mt-14 mb-4">Qué es demo y qué sigue</h2>
      <div className="card overflow-hidden">
        <div className="hidden sm:grid grid-cols-4 bg-ink text-white text-xs font-bold uppercase tracking-wider p-4"><div>Módulo</div><div className="col-span-1">Primera versión</div><div>Estado</div><div>Evolución</div></div>
        {MODULES.map(([m, d, f, e]) => (
          <div key={m} className="grid sm:grid-cols-4 gap-1 sm:gap-4 p-4 border-b border-mist last:border-0 items-center">
            <div className="font-bold">{m}</div><div className="text-sm text-slate-600">{d}</div><div><FlagBadge flag={f} /></div><div className="text-sm font-semibold text-brand">{e}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3 items-center">
        <Link href="/admin/integraciones" className="btn btn-outline" onClick={() => loginAs("admin")}>Ver integraciones y arquitectura</Link>
        <button className="btn btn-danger" onClick={() => { if (confirm("¿Restablecer todos los datos de la demo?")) resetDemo(); }}>Restablecer datos de la demo</button>
      </div>
    </div>
  );
}
