"use client";
import { useState } from "react";
import type { Appointment, Block, Patient, Service } from "@/lib/types";
import { DAYS_SHORT, addDays, addMonths, dow, fmtTime, longDate, monthName, startOfMonth, startOfWeek, toMin, todayStr } from "@/lib/dates";

type View = "dia" | "semana" | "mes";
const H0 = 8, H1 = 20, PX = 0.9; // px por minuto
const COLOR: Record<string, string> = {
  pendiente: "bg-amber/90 text-ink border-amber",
  confirmada: "bg-brand text-white border-brand",
  completada: "bg-slate-300 text-slate-700 border-slate-300",
  no_asistio: "bg-orange-300 text-ink border-orange-300",
};

export function Calendar({ appts, blocks, patients, services, onSelect, onSlot, onRemoveBlock }: {
  appts: Appointment[]; blocks: Block[]; patients: Patient[]; services: Service[];
  onSelect: (a: Appointment) => void;
  onSlot?: (date: string, time: string) => void;
  onRemoveBlock?: (id: string) => void;
}) {
  const today = todayStr();
  const [view, setView] = useState<View>("semana");
  const [cursor, setCursor] = useState(today);

  const move = (n: number) => setCursor(view === "mes" ? addMonths(cursor, n) : addDays(cursor, view === "semana" ? 7 * n : n));
  const title = view === "mes" ? monthName(cursor) : view === "dia" ? longDate(cursor) : `${longDate(startOfWeek(cursor))} – ${longDate(addDays(startOfWeek(cursor), 6))}`;
  const live = appts.filter((a) => a.status !== "cancelada");

  const Timeline = ({ dates }: { dates: string[] }) => {
    const hours = Array.from({ length: H1 - H0 }, (_, i) => H0 + i);
    return (
      <div className="overflow-x-auto">
        <div style={{ minWidth: dates.length > 1 ? 760 : 320 }}>
          <div className="grid" style={{ gridTemplateColumns: `52px repeat(${dates.length}, 1fr)` }}>
            <div />
            {dates.map((d) => (
              <div key={d} className={`text-center py-2 border-b border-mist ${d === today ? "text-brand font-extrabold" : ""}`}>
                <div className="text-xs font-bold uppercase">{DAYS_SHORT[(dow(d) + 6) % 7]}</div>
                <div className="font-display text-2xl leading-none">{Number(d.slice(8))}</div>
              </div>
            ))}
          </div>
          <div className="grid relative" style={{ gridTemplateColumns: `52px repeat(${dates.length}, 1fr)`, height: (H1 - H0) * 60 * PX }}>
            <div>{hours.map((h) => <div key={h} className="text-[.65rem] text-slate-400 text-right pr-2" style={{ height: 60 * PX }}>{h}:00</div>)}</div>
            {dates.map((d) => (
              <div key={d} className={`relative border-l border-mist ${d === today ? "bg-brand/5" : ""}`}>
                {hours.map((h) => (
                  <button key={h} type="button" aria-label={`Crear cita ${d} ${h}:00`} disabled={!onSlot} onClick={() => onSlot?.(d, `${String(h).padStart(2, "0")}:00`)} className="block w-full border-t border-mist/70 hover:bg-brand/5 disabled:hover:bg-transparent" style={{ height: 60 * PX }} />
                ))}
                {blocks.filter((b) => b.date === d).map((b) => (
                  <div key={b.id} className="absolute inset-x-0.5 rounded-lg bg-slate-200 border border-dashed border-slate-400 text-slate-600 text-[.7rem] px-1.5 py-1 overflow-hidden"
                    style={{ top: (toMin(b.start) - H0 * 60) * PX, height: Math.max(22, (toMin(b.end) - toMin(b.start)) * PX) }}>
                    {b.reason}{onRemoveBlock && <button className="ml-1 font-bold underline" onClick={() => onRemoveBlock(b.id)}>quitar</button>}
                  </div>
                ))}
                {live.filter((a) => a.date === d).map((a) => {
                  const s = services.find((x) => x.id === a.serviceId);
                  const p = patients.find((x) => x.id === a.patientId);
                  return (
                    <button key={a.id} onClick={() => onSelect(a)} title={`${p?.name} · ${s?.name}`}
                      className={`absolute inset-x-0.5 rounded-lg border text-left px-1.5 py-1 overflow-hidden text-[.72rem] leading-tight shadow-sm hover:brightness-110 ${COLOR[a.status]}`}
                      style={{ top: (toMin(a.time) - H0 * 60) * PX, height: Math.max(24, (s?.duration ?? 60) * PX - 2) }}>
                      <b>{fmtTime(a.time)}</b> {p?.name.split(" (")[0]}<div className="opacity-80 truncate">{s?.name}</div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const Month = () => {
    const first = startOfMonth(cursor);
    const start = startOfWeek(first);
    const cells = Array.from({ length: 42 }, (_, i) => addDays(start, i));
    return (
      <div>
        <div className="grid grid-cols-7 text-center text-xs font-bold uppercase text-slate-500 pb-2">{DAYS_SHORT.map((d) => <div key={d}>{d}</div>)}</div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((d) => {
            const list = live.filter((a) => a.date === d);
            const inMonth = d.slice(0, 7) === first.slice(0, 7);
            return (
              <button key={d} onClick={() => { setCursor(d); setView("dia"); }} className={`min-h-16 sm:min-h-24 rounded-xl p-1.5 text-left border transition hover:border-brand ${d === today ? "border-brand bg-brand/5" : "border-mist"} ${inMonth ? "bg-white" : "bg-slate-50 text-slate-300"}`}>
                <div className="font-bold text-sm">{Number(d.slice(8))}</div>
                {list.length > 0 && <div className="mt-1 chip bg-brand text-white !px-1.5 !py-0.5">{list.length} <span className="hidden sm:inline">cita{list.length > 1 ? "s" : ""}</span></div>}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="card p-4">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <button className="btn btn-outline btn-sm" onClick={() => move(-1)} aria-label="Anterior">Ant.</button>
          <button className="btn btn-outline btn-sm" onClick={() => setCursor(today)}>Hoy</button>
          <button className="btn btn-outline btn-sm" onClick={() => move(1)} aria-label="Siguiente">Sig.</button>
          <h3 className="font-display text-2xl font-extrabold uppercase ml-2">{title}</h3>
        </div>
        <div className="flex gap-1 bg-mist rounded-full p-1">
          {([["dia", "Día"], ["semana", "Semana"], ["mes", "Mes"]] as [View, string][]).map(([k, l]) => (
            <button key={k} onClick={() => setView(k)} aria-pressed={view === k} className={`px-4 py-1.5 rounded-full text-sm font-bold ${view === k ? "bg-ink text-white" : ""}`}>{l}</button>
          ))}
        </div>
      </div>
      {view === "dia" && <Timeline dates={[cursor]} />}
      {view === "semana" && <Timeline dates={Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(cursor), i))} />}
      {view === "mes" && <Month />}
      <div className="flex flex-wrap gap-3 mt-4 text-xs text-slate-600">
        <span><i className="inline-block size-2.5 rounded bg-amber mr-1" />Pendiente</span>
        <span><i className="inline-block size-2.5 rounded bg-brand mr-1" />Confirmada</span>
        <span><i className="inline-block size-2.5 rounded bg-slate-300 mr-1" />Completada</span>
        <span><i className="inline-block size-2.5 rounded border border-dashed border-slate-400 bg-slate-200 mr-1" />Horario bloqueado</span>
        <span>Espacios vacíos = disponibles{onSlot ? " (clic para crear cita)" : ""}</span>
      </div>
    </div>
  );
}
