"use client";
import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Modal, PageHead } from "@/components/ui";
import { shortDate, todayStr } from "@/lib/dates";
import { defaultLog, defaultStart, stats } from "@/lib/gamification";

export default function Pacientes() {
  const { db, createPatient } = useStore();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ name: "", email: "", phone: "" });
  const today = todayStr();
  const list = db.patients.filter((p) => (p.name + p.email + p.phone).toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <PageHead title="Pacientes" sub="Contacto, historial de citas y seguimiento administrativo." flag="demo">
        <button className="btn btn-primary" onClick={() => setOpen(true)}>+ Nuevo paciente</button>
      </PageHead>
      <input className="input mb-4 max-w-md" placeholder="Buscar por nombre, correo o teléfono…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar pacientes" />
      <div className="card overflow-hidden">
        <div className="hidden md:grid grid-cols-12 bg-ink text-white text-xs font-bold uppercase tracking-wider p-4"><div className="col-span-4">Paciente</div><div className="col-span-3">Contacto</div><div className="col-span-2">Citas</div><div className="col-span-2">Próxima</div><div className="col-span-1" /></div>
        {list.map((p) => {
          const ap = db.appointments.filter((a) => a.patientId === p.id);
          const st = stats(db.exLog?.[p.id] ?? defaultLog(p.id, today), db.exStart?.[p.id] ?? defaultStart(p.id, today), today);
          const next = ap.filter((a) => a.date >= today && a.status !== "cancelada" && a.status !== "completada").sort((a, b) => a.date.localeCompare(b.date))[0];
          return (
            <div key={p.id} className="grid md:grid-cols-12 gap-1 md:gap-3 p-4 border-b border-mist last:border-0 items-center">
              <div className="md:col-span-4"><div className="font-bold">{p.name}</div><div className="text-xs text-slate-500 mt-0.5">{st.adherence === null ? "Sin plan de ejercicios" : `Adherencia ${st.adherence} % · Racha ${st.current} ${st.current === 1 ? "día" : "días"}`}</div></div>
              <div className="md:col-span-3 text-sm text-slate-600">{p.phone}<br />{p.email}</div>
              <div className="md:col-span-2 text-sm">{ap.length} cita{ap.length === 1 ? "" : "s"}</div>
              <div className="md:col-span-2 text-sm">{next ? shortDate(next.date) : "—"}</div>
              <div className="md:col-span-1"><Link href={`/admin/pacientes/${p.id}`} className="btn btn-outline btn-sm">Abrir</Link></div>
            </div>
          );
        })}
        {!list.length && <p className="p-8 text-center text-slate-500">Sin resultados.</p>}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Nuevo paciente">
        <form onSubmit={(e) => { e.preventDefault(); createPatient(f); setF({ name: "", email: "", phone: "" }); setOpen(false); }} className="grid gap-3">
          <div><label className="label" htmlFor="pn">Nombre</label><input id="pn" required className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
          <div><label className="label" htmlFor="pe">Correo</label><input id="pe" type="email" required className="input" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
          <div><label className="label" htmlFor="pt">Teléfono</label><input id="pt" required className="input" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></div>
          <p className="text-xs text-slate-500">Usa solo datos ficticios en esta demo.</p>
          <button className="btn btn-primary">Guardar</button>
        </form>
      </Modal>
    </>
  );
}
