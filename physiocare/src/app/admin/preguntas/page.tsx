"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Empty, Modal, PageHead } from "@/components/ui";
import type { Question } from "@/lib/types";

export default function PreguntasAdmin() {
  const { db, updateQuestion } = useStore();
  const [tab, setTab] = useState<Question["status"]>("pendiente");
  const [q, setQ] = useState<Question | null>(null);
  const [ans, setAns] = useState("");
  const [svc, setSvc] = useState("");
  const list = db.questions.filter((x) => x.status === tab);
  const topics = Object.entries(db.questions.reduce<Record<string, number>>((m, x) => ({ ...m, [x.topic]: (m[x.topic] ?? 0) + 1 }), {})).sort((a, b) => b[1] - a[1]);
  const fromForum = db.appointments.filter((a) => a.source === "foro").length;
  return (
    <>
      <PageHead title="Preguntas de pacientes" sub="Nada se publica sin tu aprobación. Responde, elige el servicio sugerido y publícalo: cada respuesta lleva un botón para agendar." flag="demo" />
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="card p-4"><div className="label">Pendientes</div><div className="font-display text-5xl font-extrabold">{db.questions.filter((x) => x.status === "pendiente").length}</div></div>
        <div className="card p-4"><div className="label">Citas desde el foro</div><div className="font-display text-5xl font-extrabold">{fromForum}</div></div>
        <div className="card p-4"><div className="label">Temas más preguntados</div><div className="text-sm mt-1">{topics.slice(0, 3).map(([t, n]) => `${t} (${n})`).join(" · ")}</div></div>
      </div>
      <div className="flex gap-2 mb-4">{(["pendiente", "publicada", "rechazada"] as const).map((s) => <button key={s} onClick={() => setTab(s)} className={`btn btn-sm capitalize ${tab === s ? "btn-blue" : "btn-outline"}`}>{s}s ({db.questions.filter((x) => x.status === s).length})</button>)}</div>
      <div className="space-y-3">
        {list.map((x) => (
          <div key={x.id} className="card p-4 flex flex-wrap items-start justify-between gap-3">
            <div className="max-w-2xl"><span className="chip bg-brand/10 text-brand">{x.topic}</span> <span className="text-xs text-slate-500">por {x.author}</span><h3 className="font-display text-2xl font-extrabold leading-tight mt-1">{x.title}</h3><p className="text-sm text-slate-600 mt-1">{x.body}</p>{x.answer && <p className="text-sm mt-2 rounded-xl bg-slate-50 p-3"><b>Respuesta:</b> {x.answer}</p>}</div>
            <div className="flex gap-2">
              <button className="btn btn-primary btn-sm" onClick={() => { setQ(x); setAns(x.answer ?? ""); setSvc(x.suggestedServiceId ?? "s_eval"); }}>{x.status === "pendiente" ? "Responder y publicar" : "Editar respuesta"}</button>
              {x.status !== "rechazada" && <button className="btn btn-danger btn-sm" onClick={() => updateQuestion(x.id, { status: "rechazada" })}>Rechazar</button>}
              {x.status === "publicada" && <button className="btn btn-outline btn-sm" onClick={() => updateQuestion(x.id, { status: "pendiente" })}>Despublicar</button>}
            </div>
          </div>
        ))}
        {!list.length && <Empty>No hay preguntas en este estado.</Empty>}
      </div>
      <Modal open={!!q} onClose={() => setQ(null)} title="Responder pregunta" wide>
        {q && (
          <form onSubmit={(e) => { e.preventDefault(); updateQuestion(q.id, { answer: ans, suggestedServiceId: svc, status: "publicada" }); setQ(null); }} className="grid gap-3">
            <div className="rounded-xl bg-slate-50 p-3 text-sm"><b>{q.title}</b><br />{q.body}</div>
            <div><label className="label" htmlFor="ra">Tu respuesta (orientación general, sin diagnósticos ni promesas)</label><textarea id="ra" required rows={5} className="input" value={ans} onChange={(e) => setAns(e.target.value)} /></div>
            <div><label className="label" htmlFor="rs">Servicio que se sugerirá para agendar</label><select id="rs" className="input" value={svc} onChange={(e) => setSvc(e.target.value)}>{db.services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
            <div className="flex justify-end gap-2"><button type="button" className="btn btn-outline" onClick={() => setQ(null)}>Cancelar</button><button className="btn btn-primary">Aprobar y publicar</button></div>
          </form>
        )}
      </Modal>
    </>
  );
}
