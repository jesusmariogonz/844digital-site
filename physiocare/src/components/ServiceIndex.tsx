"use client";
import { useState } from "react";
import Link from "next/link";
import type { Service } from "@/lib/types";
import { money } from "@/lib/dates";
import { Img } from "./ui";

/** Servicios como índice editorial: lista numerada y una foto grande que cambia con el cursor. */
export function ServiceIndex({ services, detailed }: { services: Service[]; detailed?: boolean }) {
  const [active, setActive] = useState(0);
  const cur = services[Math.min(active, services.length - 1)];
  if (!cur) return null;
  return (
    <div className="grid lg:grid-cols-12 gap-x-12 gap-y-8">
      <div className="hidden lg:block lg:col-span-5">
        <div className="sticky top-24">
          <div className="grain aspect-[4/5] bg-ink">
            <Img key={cur.id} src={cur.image} alt="" className="reveal !opacity-100" />
          </div>
          <div className="flex items-baseline justify-between border-b border-ink pb-2 mt-3 font-display uppercase tracking-[.12em] text-sm">
            <span>{String(active + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}</span>
            <span>{cur.duration} min</span>
          </div>
        </div>
      </div>
      <ol className="lg:col-span-7 rule">
        {services.map((s, i) => (
          <li key={s.id} className={`rule-b border-l-[5px] transition-colors ${i === active ? "border-l-amber" : "border-l-transparent"}`} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)}>
            <div className="lg:hidden grain aspect-[16/9] mb-4 mt-4"><Img src={s.image} alt="" /></div>
            <div className="grid grid-cols-[2.5rem_1fr] sm:grid-cols-[3.5rem_1fr_auto] gap-x-4 gap-y-3 py-6 pl-3 sm:pl-5 items-start">
              <span className="font-display text-xl text-slate-500 pt-2">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-display text-4xl sm:text-5xl font-extrabold uppercase leading-[.9]">{s.name}</h3>
                <p className="mt-2 text-slate-700 max-w-xl">{detailed ? s.description : s.short}</p>
                {detailed && (
                  <ul className="mt-3 space-y-1 text-sm text-slate-700">
                    {s.benefits.map((b) => <li key={b} className="flex gap-3"><span className="text-amber font-bold">—</span>{b}</li>)}
                  </ul>
                )}
              </div>
              <div className="col-start-2 sm:col-start-3 sm:text-right flex sm:block items-center gap-4">
                <div className="font-display text-4xl font-bold leading-none">{money(s.price)}</div>
                <div className="text-sm text-slate-500 sm:mt-1">{s.duration} min</div>
                <Link href={`/agendar?servicio=${s.id}`} className="btn btn-primary btn-sm sm:mt-3 ml-auto sm:ml-0">Agendar</Link>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
