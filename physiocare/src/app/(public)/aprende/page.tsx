"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Img } from "@/components/ui";
import { SectionHead } from "@/components/cards";
import { Player } from "@/components/Player";
import type { ContentItem } from "@/lib/types";

const TABS = [["todo", "Todo"], ["video", "Videos"], ["instagram", "Instagram"], ["consejo", "Consejos"], ["novedad", "Novedades"]] as const;
const LABEL: Record<string, string> = { video: "Video", instagram: "Instagram", consejo: "Consejo", novedad: "Novedad" };

export default function Aprende() {
  const { db } = useStore();
  const [tab, setTab] = useState<string>("todo");
  const [q, setQ] = useState("");
  const pub = db.content.filter((c) => c.published);
  const featured = pub.find((c) => c.featured && c.type === "video") ?? pub.find((c) => c.type === "video");
  const list = useMemo(
    () => pub.filter((c) => (tab === "todo" || c.type === tab) && (c.title + c.description + c.category).toLowerCase().includes(q.toLowerCase())),
    [pub, tab, q],
  );
  return (
    <div className="container-x pt-14">
      <SectionHead h1 eyebrow="Biblioteca" title="Aprende y conoce">Videos, consejos de movilidad, Reels y novedades del consultorio. Información general: no sustituye una valoración profesional.</SectionHead>

      {featured && (
        <div className="card-dark overflow-hidden grid lg:grid-cols-5 mb-12">
          <div className="lg:col-span-3 p-4 sm:p-6"><Player item={featured} /></div>
          <div className="lg:col-span-2 p-6 sm:p-8 flex flex-col justify-center">
            <span className="chip bg-amber text-ink self-start">Video destacado</span>
            <h2 className="font-display text-4xl font-extrabold uppercase leading-none mt-3">{featured.title}</h2>
            <p className="text-white/70 mt-3">{featured.description}</p>
            <Link href="/agendar?servicio=s_eval" className="btn btn-primary mt-6 self-start">Agendar valoración</Link>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="scroll-x flex gap-2" role="tablist">
          {TABS.map(([k, l]) => (
            <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`btn btn-sm ${tab === k ? "btn-blue" : "btn-outline"}`}>{l}</button>
          ))}
        </div>
        <input className="input !w-auto flex-1 min-w-48 !py-2" placeholder="Buscar tema…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {list.map((c) => {
          const inner = (
            <>
              <div className="aspect-video overflow-hidden relative">
                <Img src={c.image} alt={c.title} />
                {c.type === "video" && <span className="absolute inset-0 grid place-items-center"><span className="size-12 rounded-full bg-amber/95 grid place-items-center"><span className="ml-0.5 border-y-8 border-y-transparent border-l-[13px] border-l-ink" /></span></span>}
                <span className="absolute top-3 left-3 chip bg-ink/80 text-white">{LABEL[c.type]}</span>
              </div>
              <div className="p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-brand">{c.category}</div>
                <h3 className="font-display text-2xl font-extrabold leading-tight mt-1">{c.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{c.description}</p>
                {c.type === "instagram" && <div className="mt-3 text-sm font-bold text-brand">Ver en Instagram ↗</div>}
              </div>
            </>
          );
          return c.url ? (
            <a key={c.id} href={c.url} target="_blank" rel="noopener noreferrer" className="card overflow-hidden hover-lift zoom block">{inner}</a>
          ) : (
            <article key={c.id} className="card overflow-hidden hover-lift zoom">{inner}</article>
          );
        })}
      </div>
      {list.length === 0 && <p className="text-center text-slate-500 py-16">No hay contenido con ese filtro.</p>}
    </div>
  );
}
