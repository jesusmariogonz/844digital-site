"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { useDemoUI } from "@/components/DemoUI";
import { FlagBadge, type Flag } from "@/components/ui";
import { PRODUCT } from "@/lib/brand";

const MODULES: [string, string, Flag, string][] = [
  ["Sitio profesional", "Diseño, servicios, multimedia", "demo", "SEO y contenido real"],
  ["Agenda y reservaciones", "Disponibilidad, calendario, citas", "demo", "Google Calendar real"],
  ["Portal del paciente", "Mi recuperación: citas, pagos, mensajes", "demo", "Autenticación real"],
  ["Pregúntale a Erik", "Foro moderado con CTA a agendar", "demo", "Base de datos y antispam"],
  ["Consola de contenido", "Subida de medios, videos, novedades", "demo", "Almacenamiento permanente"],
  ["Notificaciones", "Correo y WhatsApp, reglas y plantillas", "pendiente", "Resend + WhatsApp Business API"],
  ["Pagos digitales", "Estados y flujo simulados", "pendiente", "Mercado Pago / Stripe"],
  ["Expediente clínico", "Concepto con datos ficticios", "proxima", "Implementación segura (NOM-004)"],
];

const FLOW = ["Marketing", "Contenido", "Preguntas", "Servicios", "Agenda", "Pago", "Paciente", "Expediente", "Seguimiento"];

export default function Demo() {
  const router = useRouter();
  const { loginAs, resetDemo } = useStore();
  const { show, set } = useDemoUI();
  return (
    <div className="container-x pt-14">
      <div className="eyebrow">Backstage · solo para presentar</div>
      <h1 className="section-title mt-2">{PRODUCT.agency} — {PRODUCT.name}</h1>
      <p className="mt-3 text-xl text-slate-700 max-w-2xl">{PRODUCT.tagline} Una plataforma digital integral para profesionales de la salud.</p>

      {/* Interruptor */}
      <section className="card p-5 mt-8 flex flex-wrap items-center justify-between gap-4" aria-label="Avisos de demostración">
        <div className="max-w-xl">
          <h2 className="font-display text-2xl font-extrabold uppercase">Avisos de demostración en el sitio</h2>
          <p className="text-sm text-slate-600 mt-1">
            <b>Apagados</b>, el sitio se ve limpio, como el producto terminado del cliente. <b>Encendidos</b>, aparecen la barra de prototipo, las etiquetas de estado y las notas de datos ficticios. Se guarda en este navegador; también funciona con <code className="bg-mist px-1 rounded">?demo=1</code> y <code className="bg-mist px-1 rounded">?demo=0</code>.
          </p>
        </div>
        <button role="switch" aria-checked={show} onClick={() => set(!show)} className={`btn ${show ? "btn-blue" : "btn-outline"}`}>
          <span className={`relative inline-block w-10 h-5 rounded-full ${show ? "bg-white/40" : "bg-slate-300"}`}><span className={`absolute top-0.5 size-4 rounded-full bg-white shadow transition-all ${show ? "left-[1.375rem]" : "left-0.5"}`} /></span>
          {show ? "Avisos encendidos" : "Avisos apagados"}
        </button>
      </section>

      {/* Dos experiencias */}
      <h2 className="font-display text-4xl font-extrabold uppercase mt-12 mb-4">Guion de la presentación</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-7">
          <span className="chip bg-amber text-ink">Experiencia 1</span>
          <h3 className="font-display text-4xl font-extrabold uppercase mt-3">Paciente</h3>
          <ol className="mt-4 space-y-2 text-slate-700 list-decimal list-inside">
            <li>Entra al sitio y conoce los servicios.</li>
            <li>Consulta disponibilidad y agenda una valoración.</li>
            <li>Paga un anticipo (simulado).</li>
            <li>Revisa «Mi recuperación»: próxima cita, ejercicios y mensajes.</li>
          </ol>
          <div className="mt-6 flex gap-2 flex-wrap"><Link href="/" className="btn btn-primary">Empezar por el sitio</Link><button className="btn btn-outline" onClick={() => { loginAs("patient", "p_ana"); router.push("/cuenta"); }}>Entrar como Ana (demo)</button></div>
        </div>
        <div className="card-dark p-7">
          <span className="chip bg-amber text-ink">Experiencia 2</span>
          <h3 className="font-display text-4xl font-extrabold uppercase mt-3">Fisioterapeuta</h3>
          <ol className="mt-4 space-y-2 text-white/80 list-decimal list-inside">
            <li>Accede al panel y ve la cita recién agendada aparecer.</li>
            <li>Consulta la agenda diaria, semanal y mensual.</li>
            <li>Abre un expediente ficticio con su evolución.</li>
            <li>Modera preguntas, sube contenido y revisa notificaciones.</li>
          </ol>
          <div className="mt-6"><button className="btn btn-primary" onClick={() => { loginAs("admin"); router.push("/admin"); }}>Entrar como Erik (demo)</button></div>
        </div>
      </div>
      <div className="mt-6 rounded-2xl bg-brand/10 border border-brand/20 p-5 text-sm">
        <b>Momento clave:</b> abre el panel de Erik en una pestaña y el sitio en otra. Al agendar como paciente, en el panel aparece al instante el aviso «Nueva cita». Cada pestaña mantiene su propia sesión y comparten los datos de la demo.
      </div>

      {/* Flujo completo */}
      <h2 className="font-display text-4xl font-extrabold uppercase mt-12 mb-4">Un producto, de punta a punta</h2>
      <ol className="flex flex-wrap items-center gap-2" aria-label="Flujo de la plataforma">
        {FLOW.map((f, i) => (
          <li key={f} className="flex items-center gap-2">
            <span className="rounded-full bg-ink text-white font-display text-xl font-bold uppercase px-4 py-1.5">{f}</span>
            {i < FLOW.length - 1 && <span className="text-brand font-bold" aria-hidden="true">→</span>}
          </li>
        ))}
      </ol>

      {/* Módulos */}
      <h2 className="font-display text-4xl font-extrabold uppercase mt-12 mb-4">Qué es demo y qué sigue</h2>
      <div className="card overflow-hidden">
        <div className="hidden sm:grid grid-cols-4 bg-ink text-white text-xs font-bold uppercase tracking-wider p-4"><div>Módulo</div><div>Primera versión</div><div>Estado</div><div>Evolución</div></div>
        {MODULES.map(([m, d, f, e]) => (
          <div key={m} className="grid sm:grid-cols-4 gap-1 sm:gap-4 p-4 border-b border-mist last:border-0 items-center">
            <div className="font-bold">{m}</div><div className="text-sm text-slate-600">{d}</div><div><FlagBadge flag={f} always /></div><div className="text-sm font-semibold text-brand">{e}</div>
          </div>
        ))}
      </div>

      {/* Marca de producto */}
      <section className="card-dark p-7 mt-12">
        <div className="eyebrow !text-amber">Producto</div>
        <h2 className="font-display text-4xl font-extrabold uppercase mt-1">Una base, muchos negocios</h2>
        <p className="mt-2 text-white/75 max-w-2xl">La marca, los colores y los servicios viven en un solo lugar, así que adaptar la plataforma a otro giro no obliga a reconstruirla.</p>
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Giros posibles">
          {PRODUCT.verticals.map((v, i) => <li key={v} className={`chip ${i === 0 ? "bg-amber text-ink" : "bg-white/10 border border-white/15"}`}>{v}</li>)}
        </ul>
      </section>

      <div className="mt-8 flex flex-wrap gap-3 items-center">
        <Link href="/admin/integraciones" className="btn btn-outline" onClick={() => loginAs("admin")}>Ver integraciones y arquitectura</Link>
        <button className="btn btn-danger" onClick={() => { if (confirm("¿Restablecer todos los datos de la demo?")) resetDemo(); }}>Restablecer datos de la demo</button>
      </div>
    </div>
  );
}
