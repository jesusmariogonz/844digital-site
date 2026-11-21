"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { BackLink, FlagBadge, PageHead, PayChip, StatusChip, Empty } from "@/components/ui";
import { recordFor } from "@/lib/seed";
import { fmtTime, shortDate, todayStr } from "@/lib/dates";
import { Evolution } from "@/components/Evolution";
import { DemoOnly } from "@/components/DemoUI";

const ROLES: [string, string, string, string][] = [
  ["Fisioterapeuta (Erik)", "Ver y editar", "Ver y editar", "Ver y editar"],
  ["Recepción / asistente", "Ver", "Solo citas y datos de contacto", "Sin acceso"],
  ["Paciente", "Solo su propio resumen (cuando se habilite)", "Sus citas", "Sin acceso a notas clínicas"],
];

export default function PacienteDetalle() {
  const { id } = useParams<{ id: string }>();
  const { db, ready, audit, updatePatient } = useStore();
  const [tab, setTab] = useState<"Datos" | "Citas" | "Expediente">("Datos");
  const p = db.patients.find((x) => x.id === id);

  useEffect(() => { if (ready && tab === "Expediente" && p) audit("Consulta de expediente", p.name); }, [tab, ready, p?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!ready) return null;
  if (!p) return <Empty>Paciente no encontrado. <BackLink href="/admin/pacientes">Volver</BackLink></Empty>;
  const ap = db.appointments.filter((a) => a.patientId === p.id).sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
  const rec = recordFor(p.id, todayStr());
  const today = todayStr();
  const nextAppt = ap.filter((a) => a.date >= today && (a.status === "pendiente" || a.status === "confirmada")).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))[0];
  const logs = db.audit.filter((l) => l.target === p.name).slice(0, 6);

  return (
    <>
      <BackLink href="/admin/pacientes">Pacientes</BackLink>
      <div className="mt-3"><PageHead title={p.name} sub={`${p.phone} · ${p.email}`} /></div>
      <div className="flex gap-2 mb-5">{(["Datos", "Citas", "Expediente"] as const).map((t) => <button key={t} onClick={() => setTab(t)} className={`btn btn-sm ${tab === t ? "btn-blue" : "btn-outline"}`}>{t}</button>)}</div>

      {tab === "Datos" && (
        <div className="card p-6 max-w-2xl">
          <label className="label" htmlFor="sg">Seguimiento administrativo</label>
          <textarea id="sg" rows={4} className="input" defaultValue={p.notes} onBlur={(e) => updatePatient(p.id, { notes: e.target.value })} placeholder="Recordatorios, preferencias de horario, pendientes…" />
          <p className="text-xs text-slate-500 mt-2">Se guarda al salir del campo. Notas administrativas, no clínicas.</p>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><dt className="label">Nacimiento</dt><dd>{p.birth ?? "—"}</dd></div><div><dt className="label">Tipo de cuenta</dt><dd>{p.demo ? "Demostración" : "Real"}</dd></div></dl>
        </div>
      )}

      {tab === "Citas" && (
        <div className="space-y-3">
          {ap.length ? ap.map((a) => (
            <div key={a.id} className="card p-4 flex flex-wrap justify-between items-center gap-3">
              <div><b>{db.services.find((s) => s.id === a.serviceId)?.name}</b><div className="text-sm text-slate-500">{shortDate(a.date)} · {fmtTime(a.time)}</div></div>
              <div className="flex gap-2"><StatusChip s={a.status} /><PayChip s={a.pay} /></div>
            </div>)) : <Empty>Sin citas.</Empty>}
        </div>
      )}

      {tab === "Expediente" && (
        <div className="space-y-5">
          <div className="rounded-2xl bg-red-50 border border-red-200 text-red-900 p-4 text-sm">
            <b>Expediente ficticio de demostración.</b> No contiene ni debe contener información clínica real. Antes de manejar expedientes reales se requiere autenticación robusta, cifrado, auditoría, consentimiento y validación de cumplimiento (LFPDPPP y NOM-004-SSA3-2012).
            <div className="mt-2"><FlagBadge flag="proxima" /></div>
          </div>
          <section className="card-dark p-6 grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="text-xs font-bold uppercase tracking-wider text-amber">Expediente</div>
              <h2 className="font-display text-5xl font-extrabold uppercase leading-none mt-1">{p.name.split(" (")[0]}</h2>
              <p className="text-white/70 mt-2">Paciente desde {p.createdAt.slice(0, 4)} · {ap.filter((a) => a.status === "completada").length} sesiones completadas</p>
              <p className="text-white/80 mt-3"><b className="text-white">Motivo:</b> {rec.motivo}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-amber">Próxima cita</div>
              {nextAppt ? (<><div className="font-display text-4xl font-extrabold uppercase leading-none mt-2">{shortDate(nextAppt.date)}</div><div className="text-white/80 mt-1">{fmtTime(nextAppt.time)} · {db.services.find((x) => x.id === nextAppt.serviceId)?.name}</div></>) : <div className="mt-2 text-white/70">Sin cita programada</div>}
            </div>
          </section>
          <section className="card p-6">
            <div className="flex items-center gap-2 flex-wrap mb-4"><h3 className="font-display text-3xl font-extrabold uppercase">Evolución</h3><DemoOnly><span className="chip bg-slate-100 text-slate-600">Datos ficticios</span></DemoOnly></div>
            <div className="max-w-3xl"><Evolution sesiones={rec.sesiones} /></div>
          </section>
          <div className="grid lg:grid-cols-2 gap-5">
            {([["Antecedentes", rec.antecedentes], ["Motivo de consulta", rec.motivo], ["Evaluación inicial", rec.evaluacion], ["Valoración profesional", rec.valoracion], ["Plan de tratamiento", rec.plan]] as [string, string][]).map(([t, v]) => (
              <section key={t} className="card p-5"><h3 className="font-display text-2xl font-extrabold uppercase">{t}</h3><p className="text-slate-700 mt-1">{v}</p></section>
            ))}
            <section className="card p-5"><h3 className="font-display text-2xl font-extrabold uppercase">Archivos adjuntos</h3>{rec.archivos.length ? <ul className="mt-2 space-y-1 text-sm">{rec.archivos.map((f) => <li key={f} className="border-b border-mist pb-1">{f}</li>)}</ul> : <p className="text-slate-500 text-sm mt-1">Sin archivos.</p>}</section>
          </div>
          <section className="card p-5">
            <h3 className="font-display text-2xl font-extrabold uppercase mb-3">Historial de sesiones</h3>
            <ol className="relative border-l-2 border-brand/30 ml-2 space-y-4">
              {rec.sesiones.map((s) => <li key={s.fecha} className="pl-5 relative"><i className="absolute -left-[7px] top-1.5 size-3 rounded-full bg-brand" /><div className="text-xs font-bold text-brand">{shortDate(s.fecha)}</div><div className="font-semibold">{s.nota}</div><div className="text-sm text-slate-500">{s.evolucion}</div><div className="mt-1 flex gap-1.5 flex-wrap"><span className="chip bg-red-50 text-red-700">Dolor {s.dolor}/10</span><span className="chip bg-blue-50 text-blue-700">Movilidad {s.movilidad}%</span><span className="chip bg-emerald-50 text-emerald-700">Fuerza {s.fuerza}%</span></div></li>)}
            </ol>
          </section>
          <div className="grid lg:grid-cols-2 gap-5">
            <section className="card p-5">
              <h3 className="font-display text-2xl font-extrabold uppercase mb-2">Permisos por rol (diseño)</h3>
              <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left text-xs uppercase text-slate-500"><th className="py-2 pr-2">Rol</th><th>Expediente</th><th>Agenda</th><th>Notas clínicas</th></tr></thead><tbody>{ROLES.map((r) => <tr key={r[0]} className="border-t border-mist align-top">{r.map((c, i) => <td key={i} className={`py-2 pr-2 ${i === 0 ? "font-bold" : ""}`}>{c}</td>)}</tr>)}</tbody></table></div>
            </section>
            <section className="card p-5">
              <h3 className="font-display text-2xl font-extrabold uppercase mb-2">Bitácora de auditoría</h3>
              {logs.length ? logs.map((l) => <div key={l.id} className="text-sm py-1.5 border-b border-mist last:border-0"><b>{l.action}</b> · {l.actor}<div className="text-xs text-slate-500">{new Date(l.at).toLocaleString("es-MX", { timeZone: "America/Monterrey" })}</div></div>) : <p className="text-sm text-slate-500">Sin accesos registrados.</p>}
              <p className="text-xs text-slate-500 mt-3">Cada consulta queda registrada. En producción: bitácora inmutable y cifrado en reposo.</p>
            </section>
          </div>
        </div>
      )}
    </>
  );
}
