"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Empty, FlagBadge, Modal, PayChip, StatusChip } from "@/components/ui";
import { SlotPicker } from "@/components/SlotPicker";
import { recordFor, EXERCISES, PLAN_SESSIONS } from "@/lib/seed";
import { Evolution } from "@/components/Evolution";
import { fmtTime, longDate, money, shortDate, todayStr } from "@/lib/dates";

const TABS = ["Mi recuperación", "Mis citas", "Pagos", "Documentos", "Perfil", "Expediente"] as const;

export default function Cuenta() {
  const router = useRouter();
  const { db, ready, logout, cancelAppt, reschedule, updatePatient, payAppt, setApptStatus, toggleExercise } = useStore();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Mi recuperación");
  const [resched, setResched] = useState<string | null>(null);
  const [slot, setSlot] = useState<{ date: string; time: string } | null>(null);
  const [saved, setSaved] = useState(false);

  const p = db.session.role === "patient" ? db.patients.find((x) => x.id === db.session.patientId) : undefined;
  if (!ready) return <div className="container-x pt-20 text-slate-500">Cargando…</div>;
  if (!p) {
    return (
      <div className="container-x pt-20 max-w-xl text-center">
        <h1 className="section-title">Tu cuenta</h1>
        <p className="text-slate-600 mt-3">Inicia sesión para ver tus citas, pagos y documentos.</p>
        <Link href="/ingresar" className="btn btn-primary mt-6">Ingresar</Link>
      </div>
    );
  }
  const today = todayStr();
  const mine = db.appointments.filter((a) => a.patientId === p.id).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const upcoming = mine.filter((a) => a.date >= today && (a.status === "pendiente" || a.status === "confirmada"));
  const history = mine.filter((a) => !upcoming.includes(a)).reverse();
  const pays = db.payments.filter((x) => x.patientId === p.id);
  const svc = (id: string) => db.services.find((s) => s.id === id)!;
  const rec = recordFor(p.id, today);
  const rAppt = db.appointments.find((a) => a.id === resched);
  const exDone = db.exDone ?? [];
  const pendingEx = EXERCISES.filter((e) => !exDone.includes(e.id)).length;
  const doneSessions = mine.filter((a) => a.status === "completada").length;
  const progress = Math.min(100, Math.round((doneSessions / PLAN_SESSIONS) * 100));
  const paid = pays.filter((x) => x.status === "aprobado").reduce((s2, x) => s2 + x.amount, 0);

  const ApptRow = ({ a, actions }: { a: (typeof mine)[number]; actions?: boolean }) => (
    <div className="card p-4 flex flex-wrap items-center gap-4 justify-between">
      <div>
        <div className="font-display text-2xl font-extrabold uppercase leading-none">{svc(a.serviceId).name}</div>
        <div className="text-slate-600 mt-1">{longDate(a.date)} · {fmtTime(a.time)}</div>
        <div className="mt-2 flex gap-2"><StatusChip s={a.status} /><PayChip s={a.pay} /></div>
      </div>
      {actions && (
        <div className="flex gap-2 flex-wrap">
          {a.pay === "sin_pago" || a.pay === "fallido" ? <button className="btn btn-blue btn-sm" onClick={() => { payAppt(a.id, "anticipo", true); setApptStatus(a.id, "confirmada"); }}>Pagar anticipo (sim.)</button> : null}
          <button className="btn btn-outline btn-sm" onClick={() => { setResched(a.id); setSlot(null); }}>Reprogramar</button>
          <button className="btn btn-danger btn-sm" onClick={() => confirm("¿Cancelar esta cita?") && cancelAppt(a.id, "paciente")}>Cancelar</button>
        </div>
      )}
    </div>
  );

  return (
    <div className="container-x pt-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="eyebrow">Mi recuperación</div>
          <h1 className="section-title mt-1">Hola, {p.name.split(" ")[0]}</h1>
        </div>
        <div className="flex gap-2"><Link href="/agendar" className="btn btn-primary">Nueva cita</Link><button className="btn btn-outline" onClick={() => { logout(); router.push("/"); }}>Cerrar sesión</button></div>
      </div>
      <div className="scroll-x flex gap-2 mt-6 border-b border-mist pb-3" role="tablist">
        {TABS.map((t) => <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`btn btn-sm ${tab === t ? "btn-blue" : "btn-outline"}`}>{t}</button>)}
      </div>

      <div className="mt-6 space-y-4">
        {tab === "Mi recuperación" && (
          <>
            <div className="grid lg:grid-cols-3 gap-4">
              <section className="card !bg-ink text-white p-6 lg:col-span-2 relative overflow-hidden">
                <div className="text-xs font-bold uppercase tracking-wider text-amber">Próxima cita</div>
                {upcoming[0] ? (
                  <>
                    <div className="font-display text-5xl sm:text-6xl font-extrabold uppercase leading-none mt-3">{shortDate(upcoming[0].date)} · {fmtTime(upcoming[0].time)}</div>
                    <div className="mt-2 text-white/80 text-lg">{svc(upcoming[0].serviceId).name}</div>
                    <div className="mt-4 flex gap-2 flex-wrap"><StatusChip s={upcoming[0].status} /><PayChip s={upcoming[0].pay} /></div>
                    <div className="mt-5 flex gap-2 flex-wrap"><button className="btn btn-primary btn-sm" onClick={() => { setResched(upcoming[0].id); setSlot(null); }}>Reprogramar</button><button className="btn btn-ghost btn-sm" onClick={() => setTab("Mis citas")}>Ver todas mis citas</button></div>
                  </>
                ) : (<><div className="font-display text-4xl font-extrabold uppercase mt-3">Sin citas próximas</div><Link href="/agendar?servicio=s_eval" className="btn btn-primary mt-4">Agendar valoración</Link></>)}
              </section>
              <section className="card p-6">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Tu progreso</div>
                <div className="font-display text-6xl font-extrabold leading-none mt-2">{progress}%</div>
                <div className="h-3 rounded-full bg-mist mt-3 overflow-hidden"><div className="h-full rounded-full bg-brand transition-all duration-1000" style={{ width: `${progress}%` }} /></div>
                <p className="text-sm text-slate-500 mt-2">{doneSessions} de {PLAN_SESSIONS} sesiones del plan (ejemplo)</p>
              </section>
            </div>

            <div className="grid lg:grid-cols-3 gap-4">
              <section className="card p-6 lg:col-span-2">
                <div className="flex items-center justify-between gap-2"><h2 className="font-display text-3xl font-extrabold uppercase">Ejercicios</h2><span className="chip bg-amber/20 text-ink">{pendingEx} pendiente{pendingEx === 1 ? "" : "s"}</span></div>
                <ul className="mt-3 divide-y divide-mist">
                  {EXERCISES.map((e) => { const on = exDone.includes(e.id); return (
                    <li key={e.id}><button onClick={() => toggleExercise(e.id)} aria-pressed={on} className="w-full flex items-center gap-3 py-3 text-left">
                      <span className={`size-7 rounded-full grid place-items-center border-2 font-bold ${on ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300"}`}>{on ? "✓" : ""}</span>
                      <span className="flex-1"><b className={on ? "line-through text-slate-400" : ""}>{e.name}</b><span className="block text-sm text-slate-500">{e.detail}</span></span>
                    </button></li>); })}
                </ul>
                <p className="text-xs text-slate-500 mt-2">Plan de ejemplo con datos ficticios.</p>
              </section>
              <div className="grid gap-4 content-start">
                <button onClick={() => setTab("Pagos")} className="card p-5 text-left hover-lift"><div className="text-xs font-bold uppercase text-slate-500">Pagos</div><div className="font-display text-4xl font-extrabold mt-1">{money(paid)}</div><div className="text-sm text-slate-500">pagado en total</div></button>
                <button onClick={() => setTab("Documentos")} className="card p-5 text-left hover-lift"><div className="text-xs font-bold uppercase text-slate-500">Documentos</div><div className="font-display text-4xl font-extrabold mt-1">{rec.archivos.length}</div><div className="text-sm text-slate-500">disponible{rec.archivos.length === 1 ? "" : "s"}</div></button>
              </div>
            </div>

            <section className="card p-6">
              <div className="flex items-center gap-2 flex-wrap"><h2 className="font-display text-3xl font-extrabold uppercase">Tu evolución</h2><span className="chip bg-slate-100 text-slate-600">Datos ficticios</span></div>
              <div className="mt-4 max-w-2xl"><Evolution sesiones={rec.sesiones} /></div>
            </section>

            <h2 className="font-display text-3xl font-extrabold uppercase pt-2">Próximas citas</h2>
            {upcoming.length ? upcoming.map((a) => <ApptRow key={a.id} a={a} actions />) : <Empty>No tienes citas próximas.</Empty>}
          </>
        )}
        {tab === "Mis citas" && (
          <>
            <h2 className="font-display text-3xl font-extrabold uppercase">Próximas</h2>
            {upcoming.length ? upcoming.map((a) => <ApptRow key={a.id} a={a} actions />) : <Empty>Sin citas próximas.</Empty>}
            <h2 className="font-display text-3xl font-extrabold uppercase pt-4">Historial</h2>
            {history.length ? history.map((a) => <ApptRow key={a.id} a={a} />) : <Empty>Aún no hay historial.</Empty>}
          </>
        )}
        {tab === "Pagos" && (
          <>
            <div className="flex items-center gap-2"><h2 className="font-display text-3xl font-extrabold uppercase">Estado de pagos</h2><FlagBadge flag="pendiente" /></div>
            {pays.length ? (
              <div className="card divide-y divide-mist">{pays.map((x) => (
                <div key={x.id} className="p-4 flex flex-wrap justify-between gap-2 items-center">
                  <div><b>{x.concept}</b> · {svc(db.appointments.find((a) => a.id === x.apptId)?.serviceId ?? "s_eval").name}<div className="text-xs text-slate-500">{x.date} · {x.method}</div></div>
                  <div className="flex items-center gap-3"><b>{money(x.amount)}</b><span className={`chip ${x.status === "aprobado" ? "bg-emerald-100 text-emerald-800" : x.status === "reembolsado" ? "bg-violet-100 text-violet-800" : "bg-red-100 text-red-700"}`}>{x.status}</span></div>
                </div>))}</div>
            ) : <Empty>Sin movimientos.</Empty>}
            <p className="text-xs text-slate-500">Pagos simulados. Reembolsos sujetos a las políticas del consultorio.</p>
          </>
        )}
        {tab === "Documentos" && (
          <>
            <h2 className="font-display text-3xl font-extrabold uppercase">Documentos disponibles</h2>
            {rec.archivos.length ? <div className="card divide-y divide-mist">{rec.archivos.map((f) => <div key={f} className="p-4 flex justify-between items-center"><span>📄 {f}</span><span className="chip bg-slate-100 text-slate-600">Ficticio · sin descarga</span></div>)}</div> : <Empty>Aún no hay documentos compartidos.</Empty>}
          </>
        )}
        {tab === "Perfil" && (
          <form className="card p-6 grid sm:grid-cols-2 gap-3 max-w-3xl" onSubmit={(e) => { e.preventDefault(); const d = new FormData(e.currentTarget); updatePatient(p.id, { name: String(d.get("name")), phone: String(d.get("phone")), birth: String(d.get("birth")) }); setSaved(true); }}>
            <div><label className="label" htmlFor="pn">Nombre</label><input id="pn" name="name" required className="input" defaultValue={p.name} /></div>
            <div><label className="label">Correo</label><input className="input bg-slate-50" value={p.email} readOnly /></div>
            <div><label className="label" htmlFor="pt">Teléfono</label><input id="pt" name="phone" required className="input" defaultValue={p.phone} /></div>
            <div><label className="label" htmlFor="pb">Fecha de nacimiento</label><input id="pb" name="birth" type="date" className="input" defaultValue={p.birth} /></div>
            <div className="sm:col-span-2 flex items-center gap-3"><button className="btn btn-primary">Guardar cambios</button>{saved && <span className="text-emerald-700 text-sm font-semibold">Guardado en la demo ✓</span>}</div>
          </form>
        )}
        {tab === "Expediente" && (
          <div className="card-dark p-8 max-w-2xl">
            <FlagBadge flag="proxima" dark />
            <h2 className="font-display text-4xl font-extrabold uppercase mt-3">Tu expediente digital</h2>
            <p className="text-white/75 mt-2">Cuando Erik habilite esta función, podrás consultar aquí un resumen de tu evolución. Requiere autenticación robusta, consentimiento y control de acceso antes de manejar información real.</p>
            <div className="mt-5 rounded-xl bg-white/5 p-4 text-sm text-white/60">🔒 Acceso no habilitado en el prototipo. El expediente ficticio se muestra solo en el panel del fisioterapeuta.</div>
          </div>
        )}
      </div>

      <Modal open={!!rAppt} onClose={() => setResched(null)} title="Reprogramar cita" wide>
        {rAppt && (
          <div>
            <SlotPicker serviceId={rAppt.serviceId} value={slot} onChange={setSlot} ignoreApptId={rAppt.id} />
            <div className="mt-6 flex justify-end gap-2"><button className="btn btn-outline" onClick={() => setResched(null)}>Cancelar</button><button className="btn btn-primary" disabled={!slot} onClick={() => { if (slot) { reschedule(rAppt.id, slot.date, slot.time); setResched(null); } }}>Confirmar nuevo horario</button></div>
          </div>
        )}
      </Modal>
    </div>
  );
}
