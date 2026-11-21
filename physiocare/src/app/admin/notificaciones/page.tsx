"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Empty, FlagBadge, PageHead } from "@/components/ui";
import { DEFAULT_SETTINGS, EVENTS, render, SAMPLE, waNumber } from "@/lib/notifications";
import type { Audience, Notice, NotifEvent } from "@/lib/types";

const TABS = ["Bitácora", "Reglas", "Plantillas", "Contacto y envío"] as const;

function Toggle({ on, onChange, label, disabled }: { on: boolean; onChange: (v: boolean) => void; label: string; disabled?: boolean }) {
  if (disabled) return <span className="text-slate-300" aria-label={`${label}: no aplica`}>—</span>;
  return (
    <button role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)}
      className={`relative w-11 h-6 rounded-full transition ${on ? "bg-brand" : "bg-slate-300"}`}>
      <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${on ? "left-[1.375rem]" : "left-0.5"}`} />
    </button>
  );
}

function NoticeCard({ n }: { n: Notice }) {
  const isWa = n.channel === "WhatsApp";
  const manual = isWa && n.audience === "Paciente" ? `https://wa.me/${waNumber(n.to)}?text=${encodeURIComponent(n.body)}` : null;
  return (
    <article className="card p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`chip ${isWa ? "bg-[#dcf8c6] text-[#075e54]" : "bg-sky-100 text-sky-800"}`}>{isWa ? "WhatsApp" : n.channel}</span>
        {n.audience && <span className={`chip ${n.audience === "Erik" ? "bg-ink text-white" : "bg-amber/30 text-ink"}`}>Para {n.audience === "Erik" ? "Erik" : "paciente"}</span>}
        <span className="chip bg-slate-100 text-slate-600">{n.status ?? "Simulado"}</span>
        {n.test && <span className="chip bg-violet-100 text-violet-800">Prueba</span>}
        <span className="ml-auto text-xs text-slate-500">{new Date(n.at).toLocaleTimeString("es-MX", { timeZone: "America/Monterrey", hour: "2-digit", minute: "2-digit" })}</span>
      </div>
      <div className="mt-2 font-bold">{n.template}</div>
      <div className="text-xs text-slate-500">Para: {n.to}</div>
      {n.subject && <div className="mt-2 text-sm"><b>Asunto:</b> {n.subject}</div>}
      <p className={`mt-1 text-sm whitespace-pre-line rounded-xl p-3 ${isWa ? "bg-[#e7ffdb]" : "bg-slate-50"}`}>{n.body}</p>
      {manual && <a href={manual} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-sm font-bold text-brand underline">Enviar manualmente desde mi WhatsApp ↗</a>}
    </article>
  );
}

export default function Notificaciones() {
  const { db, setNotifRule, setNotifContact, sendReminders, sendTest } = useStore();
  const cfg = db.notif ?? DEFAULT_SETTINGS;
  const [tab, setTab] = useState<(typeof TABS)[number]>("Bitácora");
  const [who, setWho] = useState<"todos" | Audience>("todos");
  const [ch, setCh] = useState<"todos" | "Correo" | "WhatsApp">("todos");
  const [msg, setMsg] = useState("");
  const [ev, setEv] = useState<NotifEvent>("confirmacion");
  const [aud, setAud] = useState<Audience>("Paciente");
  const [contact, setContact] = useState({ email: cfg.erikEmail, wa: cfg.erikWhatsapp });
  const [saved, setSaved] = useState(false);

  const list = db.notices.filter((n) => (who === "todos" || n.audience === who) && (ch === "todos" || n.channel === ch));
  const evMeta = EVENTS.find((e) => e.id === ev)!;
  const audOk = (a: Audience) => (a === "Paciente" ? evMeta.patient : evMeta.erik);
  const activeAud: Audience = audOk(aud) ? aud : aud === "Paciente" ? "Erik" : "Paciente";
  const email = render(ev, activeAud, "Correo", SAMPLE);
  const wa = render(ev, activeAud, "WhatsApp", SAMPLE);

  const remind = (k: "recordatorio24" | "recordatorioHoy") => {
    const n = sendReminders(k);
    setMsg(n ? `Se generaron los recordatorios de ${n} cita${n > 1 ? "s" : ""} (simulados).` : `No hay citas ${k === "recordatorio24" ? "para mañana" : "para hoy"} por recordar.`);
    setTab("Bitácora");
  };

  return (
    <>
      <PageHead title="Notificaciones" sub="Correo y WhatsApp para tus pacientes y para ti. Tú decides qué se envía y a quién." flag="pendiente" />
      <div className="rounded-xl bg-sky-50 text-sky-900 text-sm p-4 mb-5"><b>Modo demostración:</b> los mensajes se generan y quedan en la bitácora, pero <b>no se envía nada real</b>. Para enviarlos de verdad se conectan un servicio de correo y la API de WhatsApp Business (pestaña «Contacto y envío»).</div>

      <div className="scroll-x flex gap-2 mb-5" role="tablist">{TABS.map((t) => <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`btn btn-sm shrink-0 ${tab === t ? "btn-blue" : "btn-outline"}`}>{t}{t === "Bitácora" && ` (${db.notices.length})`}</button>)}</div>

      {tab === "Bitácora" && (
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <button className="btn btn-primary btn-sm" onClick={() => remind("recordatorio24")}>Simular recordatorios de mañana (24 h)</button>
            <button className="btn btn-outline btn-sm" onClick={() => remind("recordatorioHoy")}>Simular recordatorios de hoy</button>
            <FlagBadge flag="config" />
          </div>
          {msg && <p role="status" className="rounded-xl bg-emerald-50 text-emerald-800 text-sm p-3 mb-4">{msg}</p>}
          <div className="flex flex-wrap gap-2 mb-4">
            {(["todos", "Paciente", "Erik"] as const).map((w) => <button key={w} onClick={() => setWho(w)} className={`btn btn-sm ${who === w ? "btn-blue" : "btn-outline"}`}>{w === "todos" ? "Todos" : w === "Paciente" ? "A pacientes" : "A Erik"}</button>)}
            <span className="w-px bg-mist mx-1" />
            {(["todos", "Correo", "WhatsApp"] as const).map((c) => <button key={c} onClick={() => setCh(c)} className={`btn btn-sm ${ch === c ? "btn-blue" : "btn-outline"}`}>{c === "todos" ? "Todos los canales" : c}</button>)}
          </div>
          {list.length ? <div className="grid xl:grid-cols-2 gap-3">{list.slice(0, 40).map((n) => <NoticeCard key={n.id} n={n} />)}</div> : <Empty>Aún no hay mensajes. Agenda una cita desde el sitio y aparecerán aquí.</Empty>}
        </div>
      )}

      {tab === "Reglas" && (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="bg-ink text-white text-xs uppercase tracking-wider">
                <th rowSpan={2} className="text-left p-3">Evento</th>
                <th colSpan={2} className="p-2 border-l border-white/10">Paciente</th>
                <th colSpan={2} className="p-2 border-l border-white/10">Erik</th>
              </tr>
              <tr className="bg-ink-2 text-white/80 text-xs"><th className="p-2 border-l border-white/10">Correo</th><th className="p-2">WhatsApp</th><th className="p-2 border-l border-white/10">Correo</th><th className="p-2">WhatsApp</th></tr>
            </thead>
            <tbody>
              {EVENTS.map((e) => {
                const r = cfg.rules[e.id];
                return (
                  <tr key={e.id} className="border-t border-mist">
                    <td className="p-3"><div className="font-semibold">{e.label}</div><div className="text-xs text-slate-500">{e.when}</div></td>
                    {(["patient", "erik"] as const).flatMap((a) => (["email", "whatsapp"] as const).map((c) => (
                      <td key={a + c} className={`p-3 text-center ${c === "email" ? "border-l border-mist" : ""}`}>
                        <Toggle disabled={a === "patient" ? !e.patient : !e.erik} on={!!r[a]?.[c]} onChange={(v) => setNotifRule(e.id, a, c, v)} label={`${e.label}: ${a === "patient" ? "paciente" : "Erik"} por ${c === "email" ? "correo" : "WhatsApp"}`} />
                      </td>
                    )))}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="p-3 text-xs text-slate-500">Los cambios se aplican a los mensajes que se generen a partir de ahora.</p>
        </div>
      )}

      {tab === "Plantillas" && (
        <div className="grid lg:grid-cols-3 gap-6 items-start">
          <div className="card p-5 space-y-3">
            <div><label className="label" htmlFor="pe">Evento</label><select id="pe" className="input" value={ev} onChange={(e) => setEv(e.target.value as NotifEvent)}>{EVENTS.map((e) => <option key={e.id} value={e.id}>{e.label}</option>)}</select></div>
            <div>
              <div className="label">Destinatario</div>
              <div className="flex gap-2">{(["Paciente", "Erik"] as const).map((a) => <button key={a} disabled={!audOk(a)} onClick={() => setAud(a)} aria-pressed={activeAud === a} className={`btn btn-sm ${activeAud === a ? "btn-blue" : "btn-outline"}`}>{a === "Paciente" ? "Paciente" : "Erik"}</button>)}</div>
            </div>
            <p className="text-xs text-slate-500">Variables: {"{nombre} {paciente} {servicio} {fecha} {hora} {monto} {concepto} {pregunta} {origen}"}. La vista previa usa datos de ejemplo.</p>
            <button className="btn btn-primary w-full" onClick={() => { sendTest(ev, activeAud); setMsg("Prueba generada: revisa la bitácora."); }}>Enviar prueba a Erik</button>
            {msg && <p role="status" className="text-sm text-emerald-700 font-semibold">{msg}</p>}
          </div>
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-4">
            <div className="card p-4"><div className="chip bg-sky-100 text-sky-800">Correo</div><div className="mt-3 text-sm"><b>Asunto:</b> {email?.subject}</div><p className="mt-2 text-sm whitespace-pre-line rounded-xl bg-slate-50 p-3">{email?.body}</p></div>
            <div className="card p-4"><div className="chip bg-[#dcf8c6] text-[#075e54]">WhatsApp</div><div className="mt-3 rounded-2xl bg-[#efeae2] p-4"><p className="rounded-xl rounded-tl-none bg-white p-3 text-sm shadow-sm whitespace-pre-line">{wa?.body}</p></div></div>
          </div>
        </div>
      )}

      {tab === "Contacto y envío" && (
        <div className="grid lg:grid-cols-2 gap-6 items-start">
          <form className="card p-5 space-y-3" onSubmit={(e) => { e.preventDefault(); setNotifContact({ erikEmail: contact.email.trim(), erikWhatsapp: contact.wa.trim() }); setSaved(true); }}>
            <h2 className="font-display text-3xl font-extrabold uppercase">Tus datos de aviso</h2>
            <p className="text-sm text-slate-600">A dónde te llegan los avisos de nuevas citas, cancelaciones, pagos y preguntas.</p>
            <div><label className="label" htmlFor="ne">Correo</label><input id="ne" type="email" required className="input" value={contact.email} onChange={(e) => { setContact({ ...contact, email: e.target.value }); setSaved(false); }} /></div>
            <div><label className="label" htmlFor="nw">WhatsApp</label><input id="nw" type="tel" required className="input" value={contact.wa} onChange={(e) => { setContact({ ...contact, wa: e.target.value }); setSaved(false); }} /></div>
            <p className="text-xs text-slate-500">Datos de ejemplo: reemplázalos por los reales.</p>
            <div className="flex items-center gap-3"><button className="btn btn-primary">Guardar</button>{saved && <span className="text-emerald-700 text-sm font-semibold">Guardado ✓</span>}</div>
          </form>
          <div className="space-y-4">
            {[
              ["Correo transaccional", "Resend, Postmark u otro. Requiere verificar tu dominio (SPF/DKIM) para que los correos no caigan en spam.", "pendiente"],
              ["WhatsApp Business API", "Cuenta de Meta Business verificada, número dedicado y plantillas aprobadas por Meta.", "config"],
              ["Programador de recordatorios", "Tarea programada (cron) que envía los recordatorios de 24 h y del mismo día de forma automática.", "config"],
            ].map(([t, d, f]) => (
              <div key={t} className="card p-5"><div className="flex items-start justify-between gap-2"><h3 className="font-display text-2xl font-extrabold uppercase leading-none">{t}</h3><FlagBadge flag={f as "pendiente" | "config"} /></div><p className="text-sm text-slate-600 mt-2">{d}</p></div>
            ))}
            <div className="card-dark p-5 text-sm text-white/80">
              <b className="text-amber">Antes de enviar mensajes reales</b>
              <ul className="mt-2 list-disc list-inside space-y-1"><li>Consentimiento del paciente para recibir mensajes por WhatsApp y correo.</li><li>Una forma sencilla de dejar de recibirlos.</li><li>No incluir datos clínicos en los mensajes.</li></ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
