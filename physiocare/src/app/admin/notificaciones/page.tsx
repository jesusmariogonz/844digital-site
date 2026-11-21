"use client";
import { useStore } from "@/lib/store";
import { Empty, FlagBadge, PageHead } from "@/components/ui";

const TEMPLATES: [string, string, string][] = [
  ["Confirmación de cita", "Correo + WhatsApp", "Hola {nombre}, tu cita de {servicio} quedó registrada para el {fecha} a las {hora}. Responde 1 para confirmar o 2 para reprogramar."],
  ["Recordatorio 24 horas antes", "WhatsApp", "Hola {nombre}, te recordamos tu cita mañana a las {hora}. Si necesitas cambiarla, avísanos con tiempo."],
  ["Recordatorio el mismo día", "WhatsApp", "Hoy tienes cita a las {hora} en Erik Fitness and Rehab. ¡Te esperamos!"],
  ["Cancelación", "Correo + WhatsApp", "Tu cita del {fecha} fue cancelada. Los reembolsos están sujetos a la política del consultorio."],
  ["Reprogramación", "Correo + WhatsApp", "Tu cita se movió al {fecha} a las {hora}."],
  ["Confirmación de pago", "Correo", "Recibimos tu {concepto} de {monto} MXN. Gracias."],
];
const ICON: Record<string, string> = { Correo: "✉", WhatsApp: "💬", "Aviso interno": "🔔" };

export default function Notificaciones() {
  const { db } = useStore();
  return (
    <>
      <PageHead title="Notificaciones" sub="Plantillas de mensajes y bitácora de avisos. En la demo los mensajes se simulan: no se envía nada real." flag="pendiente" />
      <div className="grid xl:grid-cols-2 gap-6">
        <section>
          <h2 className="font-display text-3xl font-extrabold uppercase mb-3">Plantillas</h2>
          <div className="space-y-3">{TEMPLATES.map(([t, c, b]) => (
            <div key={t} className="card p-4"><div className="flex justify-between gap-2"><b>{t}</b><span className="chip bg-slate-100 text-slate-600">{c}</span></div><p className="text-sm text-slate-600 mt-2 rounded-xl bg-[#e7ffdb] p-3">{b}</p></div>))}</div>
          <div className="mt-3 flex gap-2 flex-wrap"><FlagBadge flag="pendiente" /><FlagBadge flag="config" /><span className="text-xs text-slate-500 self-center">WhatsApp Business API requiere cuenta verificada y plantillas aprobadas por Meta.</span></div>
        </section>
        <section>
          <h2 className="font-display text-3xl font-extrabold uppercase mb-3">Bitácora de la demo</h2>
          {db.notices.length ? <div className="space-y-2">{db.notices.slice(0, 20).map((n) => (
            <div key={n.id} className="card p-3 text-sm"><div className="flex justify-between gap-2"><b>{ICON[n.channel]} {n.channel} · {n.template}</b><span className="text-xs text-slate-500">{new Date(n.at).toLocaleTimeString("es-MX", { timeZone: "America/Monterrey", hour: "2-digit", minute: "2-digit" })}</span></div><div className="text-xs text-slate-500">Para: {n.to}</div><p className="mt-1">{n.body}</p></div>))}</div>
            : <Empty>Aún no hay avisos. Agenda una cita desde el sitio y aparecerán aquí.</Empty>}
        </section>
      </div>
    </>
  );
}
