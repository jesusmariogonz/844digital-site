"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Calendar } from "@/components/Calendar";
import { SlotPicker } from "@/components/SlotPicker";
import { Modal, PageHead, PayChip, StatusChip } from "@/components/ui";
import { fmtTime, longDate, money, todayStr } from "@/lib/dates";
import type { Appointment } from "@/lib/types";

export default function Agenda() {
  const { db, book, setApptStatus, cancelAppt, reschedule, addBlock, removeBlock, refund } = useStore();
  const [sel, setSel] = useState<string | null>(null);
  const [mode, setMode] = useState<null | "nueva" | "bloqueo" | "mover">(null);
  const [f, setF] = useState({ patientId: "", serviceId: "s_eval", reason: "" });
  const [slot, setSlot] = useState<{ date: string; time: string } | null>(null);
  const [blk, setBlk] = useState({ date: todayStr(), start: "09:00", end: "10:00", reason: "" });
  const a: Appointment | undefined = db.appointments.find((x) => x.id === sel);
  const pat = (id: string) => db.patients.find((p) => p.id === id);
  const svc = (id: string) => db.services.find((s) => s.id === id)!;

  const openNew = (date?: string, time?: string) => { setF({ patientId: db.patients[0]?.id ?? "", serviceId: "s_eval", reason: "" }); setSlot(date && time ? { date, time } : null); setMode("nueva"); };

  return (
    <>
      <PageHead title="Agenda" sub="Vista diaria, semanal y mensual. Haz clic en una cita para gestionarla o en un espacio vacío para crear una." flag="demo">
        <button className="btn btn-primary" onClick={() => openNew()}>+ Nueva cita</button>
        <button className="btn btn-outline" onClick={() => setMode("bloqueo")}>Bloquear horario</button>
      </PageHead>
      <Calendar appts={db.appointments} blocks={db.blocks} patients={db.patients} services={db.services} onSelect={(x) => setSel(x.id)} onSlot={openNew} onRemoveBlock={removeBlock} />
      <div className="mt-4 rounded-xl bg-sky-50 text-sky-900 text-sm p-4">
        <b>Google Calendar:</b> la sincronización con tu cuenta de Gmail (OAuth, bidireccional, sin citas duplicadas, zona horaria de Saltillo) es una <b>integración pendiente</b>. En esta demo la agenda es local y no se conecta con Google.
      </div>

      <Modal open={!!a && !mode} onClose={() => setSel(null)} title="Detalle de cita">
        {a && (
          <div className="space-y-3">
            <div><div className="font-display text-3xl font-extrabold uppercase leading-none">{svc(a.serviceId).name}</div><div className="text-slate-600 mt-1">{longDate(a.date)} · {fmtTime(a.time)} · {svc(a.serviceId).duration} min</div></div>
            <div className="rounded-xl bg-slate-50 p-3 text-sm"><b>{pat(a.patientId)?.name}</b><br />{pat(a.patientId)?.phone} · {pat(a.patientId)?.email}{a.reason && <><br />Motivo: {a.reason}</>}<br />Origen: {a.source}</div>
            <div className="flex gap-2"><StatusChip s={a.status} /><PayChip s={a.pay} /><span className="chip bg-slate-100 text-slate-600">{money(svc(a.serviceId).price)}</span></div>
            <div className="flex flex-wrap gap-2 pt-2">
              {a.status === "pendiente" && <button className="btn btn-blue btn-sm" onClick={() => setApptStatus(a.id, "confirmada")}>Confirmar</button>}
              {(a.status === "confirmada" || a.status === "pendiente") && <>
                <button className="btn btn-outline btn-sm" onClick={() => setApptStatus(a.id, "completada")}>Marcar completada</button>
                <button className="btn btn-outline btn-sm" onClick={() => setApptStatus(a.id, "no_asistio")}>No asistió</button>
                <button className="btn btn-outline btn-sm" onClick={() => { setSlot(null); setMode("mover"); }}>Reprogramar</button>
                <button className="btn btn-danger btn-sm" onClick={() => { cancelAppt(a.id, "consultorio"); setSel(null); }}>Cancelar cita</button>
              </>}
              {(a.pay === "anticipo" || a.pay === "pagado") && a.status === "cancelada" && <button className="btn btn-outline btn-sm" onClick={() => refund(a.id)}>Reembolsar (sim.)</button>}
            </div>
          </div>
        )}
      </Modal>

      <Modal open={mode === "nueva"} onClose={() => setMode(null)} title="Nueva cita manual" wide>
        <form onSubmit={(e) => { e.preventDefault(); if (!slot) return; book({ ...f, ...slot, source: "manual", manual: true }); setMode(null); }} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div><label className="label" htmlFor="np">Paciente</label><select id="np" className="input" value={f.patientId} onChange={(e) => setF({ ...f, patientId: e.target.value })}>{db.patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
            <div><label className="label" htmlFor="ns">Servicio</label><select id="ns" className="input" value={f.serviceId} onChange={(e) => { setF({ ...f, serviceId: e.target.value }); setSlot(null); }}>{db.services.filter((s) => s.active).map((s) => <option key={s.id} value={s.id}>{s.name} ({s.duration} min)</option>)}</select></div>
          </div>
          <input className="input" placeholder="Motivo (opcional)" value={f.reason} onChange={(e) => setF({ ...f, reason: e.target.value })} aria-label="Motivo" />
          <SlotPicker key={f.serviceId} serviceId={f.serviceId} value={slot} onChange={setSlot} />
          <div className="flex justify-end gap-2"><button type="button" className="btn btn-outline" onClick={() => setMode(null)}>Cancelar</button><button className="btn btn-primary" disabled={!slot}>Crear cita</button></div>
        </form>
      </Modal>

      <Modal open={mode === "mover" && !!a} onClose={() => setMode(null)} title="Reprogramar" wide>
        {a && <div><SlotPicker serviceId={a.serviceId} value={slot} onChange={setSlot} ignoreApptId={a.id} /><div className="flex justify-end gap-2 mt-5"><button className="btn btn-outline" onClick={() => setMode(null)}>Cancelar</button><button className="btn btn-primary" disabled={!slot} onClick={() => { if (slot) { reschedule(a.id, slot.date, slot.time); setMode(null); setSel(null); } }}>Mover cita</button></div></div>}
      </Modal>

      <Modal open={mode === "bloqueo"} onClose={() => setMode(null)} title="Bloquear horario">
        <form onSubmit={(e) => { e.preventDefault(); addBlock(blk); setMode(null); }} className="grid gap-3">
          <div><label className="label" htmlFor="bd">Fecha</label><input id="bd" type="date" required className="input" value={blk.date} onChange={(e) => setBlk({ ...blk, date: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3"><div><label className="label" htmlFor="bs">Desde</label><input id="bs" type="time" required className="input" value={blk.start} onChange={(e) => setBlk({ ...blk, start: e.target.value })} /></div><div><label className="label" htmlFor="be">Hasta</label><input id="be" type="time" required className="input" value={blk.end} onChange={(e) => setBlk({ ...blk, end: e.target.value })} /></div></div>
          <div><label className="label" htmlFor="br">Motivo</label><input id="br" required className="input" placeholder="Comida, curso, descanso…" value={blk.reason} onChange={(e) => setBlk({ ...blk, reason: e.target.value })} /></div>
          <button className="btn btn-primary" disabled={blk.end <= blk.start}>Bloquear</button>
        </form>
      </Modal>
    </>
  );
}
