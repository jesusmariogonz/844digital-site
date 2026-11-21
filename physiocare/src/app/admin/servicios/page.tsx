"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Img, Modal, PageHead } from "@/components/ui";
import { IMG } from "@/lib/images";
import { money, uid, DAYS_SHORT } from "@/lib/dates";
import type { Service } from "@/lib/types";

const blank = (): Service => ({ id: uid("s"), name: "", short: "", description: "", benefits: [], duration: 60, price: 600, deposit: 200, days: [1, 2, 3, 4, 5], active: true, image: IMG.stretch });
const DAY_IDX = [1, 2, 3, 4, 5, 6, 0];

export default function Servicios() {
  const { db, upsertService } = useStore();
  const [edit, setEdit] = useState<Service | null>(null);
  const [isNew, setIsNew] = useState(false);
  const imgs = Object.entries(IMG);
  return (
    <>
      <PageHead title="Servicios" sub="Crea, edita, fija precios y duración, y activa o desactiva lo que aparece en el sitio y la agenda." flag="demo">
        <button className="btn btn-primary" onClick={() => { setEdit(blank()); setIsNew(true); }}>+ Nuevo servicio</button>
      </PageHead>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {db.services.map((s) => (
          <div key={s.id} className={`card overflow-hidden ${s.active ? "" : "opacity-60"}`}>
            <div className="h-32"><Img src={s.image} alt="" /></div>
            <div className="p-4">
              <div className="flex justify-between gap-2"><h3 className="font-display text-2xl font-extrabold uppercase leading-none">{s.name}</h3><span className={`chip ${s.active ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"}`}>{s.active ? "Activo" : "Inactivo"}</span></div>
              <div className="text-sm text-slate-600 mt-1">{s.duration} min · {money(s.price)} · anticipo {money(s.deposit)}</div>
              <div className="mt-3 flex gap-2"><button className="btn btn-outline btn-sm" onClick={() => { setEdit(s); setIsNew(false); }}>Editar</button><button className="btn btn-outline btn-sm" onClick={() => upsertService({ ...s, active: !s.active })}>{s.active ? "Desactivar" : "Activar"}</button></div>
            </div>
          </div>
        ))}
      </div>
      <Modal open={!!edit} onClose={() => setEdit(null)} title={isNew ? "Nuevo servicio" : "Editar servicio"} wide>
        {edit && (
          <form onSubmit={(e) => { e.preventDefault(); upsertService({ ...edit, benefits: edit.benefits.filter(Boolean) }); setEdit(null); }} className="grid sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2"><label className="label" htmlFor="sn">Nombre</label><input id="sn" required className="input" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></div>
            <div className="sm:col-span-2"><label className="label" htmlFor="ss">Resumen corto</label><input id="ss" required className="input" value={edit.short} onChange={(e) => setEdit({ ...edit, short: e.target.value })} /></div>
            <div className="sm:col-span-2"><label className="label" htmlFor="sd">Descripción</label><textarea id="sd" required rows={3} className="input" value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} /></div>
            <div className="sm:col-span-2"><label className="label" htmlFor="sb">Beneficios (uno por línea; sin promesas de resultados)</label><textarea id="sb" rows={3} className="input" value={edit.benefits.join("\n")} onChange={(e) => setEdit({ ...edit, benefits: e.target.value.split("\n") })} /></div>
            <div><label className="label" htmlFor="sdu">Duración (min)</label><input id="sdu" type="number" min={15} step={15} required className="input" value={edit.duration} onChange={(e) => setEdit({ ...edit, duration: Number(e.target.value) })} /></div>
            <div><label className="label" htmlFor="sp">Precio (MXN)</label><input id="sp" type="number" min={0} required className="input" value={edit.price} onChange={(e) => setEdit({ ...edit, price: Number(e.target.value) })} /></div>
            <div><label className="label" htmlFor="sa">Anticipo (MXN)</label><input id="sa" type="number" min={0} className="input" value={edit.deposit} onChange={(e) => setEdit({ ...edit, deposit: Number(e.target.value) })} /></div>
            <div><label className="label">Días disponibles</label><div className="flex flex-wrap gap-1">{DAY_IDX.map((d, i) => { const on = edit.days.includes(d); return <button key={d} type="button" aria-pressed={on} onClick={() => setEdit({ ...edit, days: on ? edit.days.filter((x) => x !== d) : [...edit.days, d] })} className={`chip ${on ? "bg-brand text-white" : "bg-mist"}`}>{DAYS_SHORT[i]}</button>; })}</div></div>
            <div className="sm:col-span-2"><label className="label">Imagen</label><div className="grid grid-cols-5 gap-2">{imgs.map(([k, u]) => <button key={k} type="button" onClick={() => setEdit({ ...edit, image: u })} className={`aspect-square rounded-lg overflow-hidden border-2 ${edit.image === u ? "border-amber" : "border-transparent"}`}><Img src={u} alt={k} /></button>)}</div></div>
            <div className="sm:col-span-2 flex justify-end gap-2"><button type="button" className="btn btn-outline" onClick={() => setEdit(null)}>Cancelar</button><button className="btn btn-primary">Guardar servicio</button></div>
          </form>
        )}
      </Modal>
    </>
  );
}
