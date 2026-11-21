"use client";
import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";

const OPTIONS: [string, string][] = [
  ["Tengo dolor", "s_dolor"],
  ["Tengo una lesión", "s_lesion"],
  ["Quiero volver a entrenar", "s_dep"],
  ["Me recupero de una cirugía", "s_post"],
  ["Quiero mejorar mi rendimiento", "s_dep"],
  ["No estoy seguro", "s_eval"],
];

export function ServiceFinder() {
  const { db } = useStore();
  const [pick, setPick] = useState<number | null>(null);
  const svc = pick === null ? null : db.services.find((s) => s.id === OPTIONS[pick][1] && s.active);
  return (
    <section id="asistente" className="card-dark p-6 sm:p-8 mb-10 scroll-mt-24" aria-labelledby="asistente-t">
      <div className="eyebrow !text-amber">Asistente</div>
      <h2 id="asistente-t" className="font-display text-4xl sm:text-5xl font-extrabold uppercase leading-none mt-1">¿Cuál necesitas?</h2>
      <p className="text-white/70 mt-2">¿Qué estás buscando?</p>
      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-2" role="radiogroup" aria-label="¿Qué estás buscando?">
        {OPTIONS.map(([label], i) => (
          <button key={label} role="radio" aria-checked={pick === i} onClick={() => setPick(i)}
            className={`text-left rounded-2xl border-2 px-4 py-3 font-semibold transition flex items-center gap-3 ${pick === i ? "border-amber bg-amber/10" : "border-white/15 hover:border-white/40"}`}>
            <span className={`size-5 rounded-full border-2 grid place-items-center ${pick === i ? "border-amber" : "border-white/40"}`}>{pick === i && <span className="size-2.5 rounded-full bg-amber" />}</span>{label}
          </button>
        ))}
      </div>
      {pick !== null && (
        <div className="mt-6 rounded-2xl bg-white text-ink p-5 reveal" role="status">
          <div className="font-display text-3xl font-extrabold uppercase leading-none">Te recomendamos comenzar con una valoración funcional</div>
          <p className="text-slate-600 mt-2">Así Erik entiende tu caso y define el plan.{svc && svc.id !== "s_eval" && <> Después, según tu valoración, podría tratarse de <b>{svc.name}</b>.</>}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/agendar?servicio=s_eval" className="btn btn-primary">Agendar valoración</Link>
            {svc && svc.id !== "s_eval" && <Link href={`/agendar?servicio=${svc.id}`} className="btn btn-outline">Ver {svc.name}</Link>}
          </div>
          <p className="text-xs text-slate-500 mt-3">Orientación general, no es un diagnóstico. Con dolor intenso en el pecho, debilidad que avanza o pérdida de control de esfínteres, acude a urgencias.</p>
        </div>
      )}
    </section>
  );
}
