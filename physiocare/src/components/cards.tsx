"use client";
import Link from "next/link";
import type { Service } from "@/lib/types";
import { money } from "@/lib/dates";
import { Img } from "./ui";

export function ServiceCard({ s, full }: { s: Service; full?: boolean }) {
  return (
    <article className="card overflow-hidden hover-lift zoom flex flex-col">
      <div className="aspect-[4/3] overflow-hidden relative">
        <Img src={s.image} alt={s.name} />
        <span className="absolute top-3 left-3 chip bg-ink/80 text-white backdrop-blur">{s.duration} min</span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display text-3xl font-extrabold uppercase leading-none">{s.name}</h3>
        <p className="text-slate-600 mt-2 text-sm">{full ? s.description : s.short}</p>
        {full && (
          <ul className="mt-3 space-y-1.5 text-sm">
            {s.benefits.map((b) => <li key={b} className="flex gap-2"><span className="text-brand font-bold">✓</span>{b}</li>)}
          </ul>
        )}
        <div className="mt-auto pt-5 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 uppercase font-bold tracking-wide">Desde</div>
            <div className="font-display text-3xl font-extrabold">{money(s.price)}</div>
          </div>
          <Link href={`/agendar?servicio=${s.id}`} className="btn btn-primary btn-sm">Agendar</Link>
        </div>
      </div>
    </article>
  );
}

export function SectionHead({ eyebrow, title, children, light, h1 }: { eyebrow: string; title: string; children?: React.ReactNode; light?: boolean; h1?: boolean }) {
  const H = h1 ? "h1" : "h2";
  return (
    <div className="max-w-3xl mb-10">
      <div className={`eyebrow ${light ? "!text-amber" : ""}`}>{eyebrow}</div>
      <H className={`section-title mt-2 ${light ? "text-white" : ""}`}>{title}</H>
      {children && <p className={`mt-4 text-lg ${light ? "text-white/75" : "text-slate-600"}`}>{children}</p>}
    </div>
  );
}
