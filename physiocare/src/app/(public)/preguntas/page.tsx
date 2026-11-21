"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { TOPICS } from "@/lib/seed";
import { FlagBadge } from "@/components/ui";
import { SectionHead } from "@/components/cards";

export default function Preguntas() {
  const { db, submitQuestion, likeQuestion } = useStore();
  const [topic, setTopic] = useState("Todas");
  const [q, setQ] = useState("");
  const [liked, setLiked] = useState<string[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [form, setForm] = useState({ topic: TOPICS[0], title: "", body: "", author: "", anon: true, consent: false });
  const [sent, setSent] = useState(false);

  const pub = db.questions.filter((x) => x.status === "publicada");
  const list = useMemo(
    () => pub.filter((x) => (topic === "Todas" || x.topic === topic) && (x.title + x.body + (x.answer ?? "")).toLowerCase().includes(q.toLowerCase())).sort((a, b) => b.me2 - a.me2),
    [pub, topic, q],
  );
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    submitQuestion({ topic: form.topic, title: form.title.trim(), body: form.body.trim(), author: form.anon || !form.author.trim() ? "Anónimo" : form.author.trim() });
    setSent(true);
    setForm({ topic: TOPICS[0], title: "", body: "", author: "", anon: true, consent: false });
  };

  return (
    <div className="container-x pt-14">
      <SectionHead h1 eyebrow="Comunidad" title="Pregúntale a Erik">
        Haz tu pregunta y Erik la responde. Todas pasan por su aprobación antes de publicarse. Información general: no sustituye una valoración.
      </SectionHead>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 min-w-0">
          <div className="flex flex-wrap gap-3 mb-5">
            <input className="input flex-1 min-w-48" placeholder="Buscar en preguntas…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar preguntas" />
          </div>
          <div className="scroll-x flex gap-2 mb-6">
            {["Todas", ...TOPICS].map((t) => <button key={t} onClick={() => setTopic(t)} className={`btn btn-sm ${topic === t ? "btn-blue" : "btn-outline"}`}>{t}</button>)}
          </div>
          <div className="space-y-4">
            {list.map((x) => {
              const svc = db.services.find((s) => s.id === x.suggestedServiceId);
              const isOpen = open === x.id;
              return (
                <article key={x.id} className="card p-5">
                  <div className="flex items-center gap-2 flex-wrap"><span className="chip bg-brand/10 text-brand">{x.topic}</span><span className="text-xs text-slate-500">por {x.author}</span></div>
                  <button className="text-left w-full" onClick={() => setOpen(isOpen ? null : x.id)} aria-expanded={isOpen}>
                    <h3 className="font-display text-2xl font-extrabold leading-tight mt-2">{x.title}</h3>
                  </button>
                  {isOpen && (
                    <div className="mt-3 reveal">
                      <p className="text-slate-500 text-sm italic">“{x.body}”</p>
                      <div className="mt-3 rounded-2xl bg-ink text-white p-5">
                        <div className="text-xs font-bold uppercase tracking-wider text-amber mb-1">Respuesta de Erik</div>
                        <p className="text-white/90">{x.answer}</p>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">Si presentas debilidad que avanza, pérdida de control de esfínteres, dolor en el pecho o fiebre con dolor intenso, acude a urgencias.</p>
                      {svc && (
                        <Link href={`/agendar?servicio=${svc.id}&origen=foro`} className="btn btn-primary btn-sm mt-3">Agendar: {svc.name}</Link>
                      )}
                    </div>
                  )}
                  <div className="mt-4 flex items-center gap-3">
                    <button disabled={liked.includes(x.id)} onClick={() => { likeQuestion(x.id); setLiked([...liked, x.id]); }} className="btn btn-outline btn-sm">
                      {liked.includes(x.id) ? "✓ Gracias" : "A mí también me pasa"} · {x.me2}
                    </button>
                    <button className="text-sm font-bold text-brand" onClick={() => setOpen(isOpen ? null : x.id)}>{isOpen ? "Ocultar" : "Ver respuesta"}</button>
                  </div>
                </article>
              );
            })}
            {list.length === 0 && <p className="text-slate-500 py-10 text-center">No hay preguntas con ese filtro.</p>}
          </div>
        </div>

        <aside className="card p-6 lg:sticky lg:top-24">
          <h3 className="font-display text-3xl font-extrabold uppercase">Haz tu pregunta</h3>
          <div className="mt-1"><FlagBadge flag="demo" /></div>
          {sent ? (
            <div className="mt-5 rounded-2xl bg-emerald-50 text-emerald-900 p-5 reveal">
              <b>¡Recibida!</b> Tu pregunta quedó en revisión. Erik la revisará y, si la aprueba, se publicará con su respuesta.
              <p className="text-sm mt-2">En esta demo aparece de inmediato en la bandeja de moderación del panel de Erik.</p>
              <button className="btn btn-outline btn-sm mt-4" onClick={() => setSent(false)}>Enviar otra</button>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-4 space-y-3">
              <div><label className="label" htmlFor="qt">Tema</label>
                <select id="qt" className="input" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}>{TOPICS.map((t) => <option key={t}>{t}</option>)}</select></div>
              <div><label className="label" htmlFor="qti">Título</label>
                <input id="qti" required minLength={8} maxLength={120} className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ej. ¿Puedo entrenar con dolor de rodilla?" /></div>
              <div><label className="label" htmlFor="qb">Tu pregunta</label>
                <textarea id="qb" required minLength={15} maxLength={600} rows={4} className="input" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.anon} onChange={(e) => setForm({ ...form, anon: e.target.checked })} /> Publicar como anónimo</label>
              {!form.anon && <input className="input" placeholder="Tu nombre (opcional)" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} aria-label="Tu nombre" />}
              <p className="text-xs text-slate-500">No incluyas diagnósticos, estudios ni datos personales sensibles.</p>
              <label className="flex gap-2 text-xs text-slate-600"><input required type="checkbox" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} className="mt-0.5" /> Acepto que mi pregunta sea revisada y, si se aprueba, publicada. (Aviso de privacidad de ejemplo.)</label>
              <button className="btn btn-primary w-full" type="submit">Enviar pregunta</button>
            </form>
          )}
        </aside>
      </div>
    </div>
  );
}
