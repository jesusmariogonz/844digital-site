"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Img } from "@/components/ui";
import { SectionHead } from "@/components/cards";
import { Player } from "@/components/Player";
import type { ContentItem } from "@/lib/types";

// Pestañas por tipo (Videos, Instagram) y por tema (Ejercicios, Dolor, Lesiones, Mitos)
const TABS: [string, string, (c: ContentItem) => boolean][] = [
  ["todo", "Todos", () => true],
  ["video", "Videos", (c) => c.type === "video"],
  ["instagram", "Instagram", (c) => c.type === "instagram"],
  ["ejercicios", "Ejercicios", (c) => c.category.toLowerCase().startsWith("ejercicio")],
  ["dolor", "Dolor", (c) => c.category.toLowerCase() === "dolor"],
  ["lesiones", "Lesiones", (c) => c.category.toLowerCase().startsWith("lesion") || c.category.toLowerCase().startsWith("lesión")],
  ["mitos", "Mitos", (c) => c.category.toLowerCase().startsWith("mito")],
];
const LABEL: Record<string, string> = { video: "Video", instagram: "Instagram", consejo: "Consejo", novedad: "Novedad" };

export default function Aprende() {
  const { db } = useStore();
  const [tab, setTab] = useState("todo");
  const [q, setQ] = useState("");
  const pub = db.content.filter((c) => c.published);
  const featured = pub.find((c) => c.featured && c.type === "video") ?? pub.find((c) => c.type === "video");
  const match = TABS.find((t) => t[0] === tab)![2];
  const list = useMemo(
    () => pub.filter((c) => match(c) && (c.title + c.description + c.category).toLowerCase().includes(q.toLowerCase())),
    [pub, match, q],
  );
  return (
    <div className="container-x pt-14">
      <SectionHead h1 eyebrow="Biblioteca" title="Aprende sobre tu cuerpo">Videos, ejercicios y consejos. Información general, no sustituye una valoración.</SectionHead>

      {featured && (
        <div className="card-dark overflow-hidden grid lg:grid-cols-5 mb-12">
          <div className="lg:col-span-3 p-4 sm:p-6"><Player item={featured} /></div>
          <div className="lg:col-span-2 p-6 sm:p-8 flex flex-col justify-center">
            <span className="chip bg-amber text-ink self-start">Video destacado</span>
            <h2 className="font-display text-4xl font-extrabold uppercase leading-none mt-3">{featured.title}</h2>
            <div className="mt-6 rounded-2xl bg-white/10 p-5">
              <h3 className="font-display text-2xl font-extrabold uppercase text-amber">¿Tienes este problema?</h3>
              <p className="text-white/80 mt-1">Conoce cómo abordarlo y cuándo es recomendable acudir a valoración.</p>
              <Link href="/agendar?servicio=s_eval" className="btn btn-primary mt-4">Agendar valoración</Link>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="scroll-x flex gap-2 max-w-full" role="tablist">
          {TABS.map(([k, l]) => (
            <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`btn btn-sm shrink-0 ${tab === k ? "btn-blue" : "btn-outline"}`}>{l}</button>
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
                {c.type === "instagram" && <div className="mt-3 text-sm font-bold text-brand">Ver en Instagram</div>}
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
