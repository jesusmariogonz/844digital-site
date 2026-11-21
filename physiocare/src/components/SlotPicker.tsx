"use client";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { slotsFor, hasFree } from "@/lib/availability";
import { DAYS_SHORT, addDays, dow, fmtTime, longDate, todayStr } from "@/lib/dates";

export function SlotPicker({ serviceId, value, onChange, ignoreApptId, autoSelect }: {
  serviceId: string;
  value: { date: string; time: string } | null;
  onChange: (v: { date: string; time: string } | null) => void;
  ignoreApptId?: string;
  autoSelect?: boolean;
}) {
  const { db } = useStore();
  const service = db.services.find((s) => s.id === serviceId)!;
  const today = todayStr();
  const [offset, setOffset] = useState(0);
  const [date, setDate] = useState<string>(value?.date ?? "");
  const days = useMemo(() => Array.from({ length: 14 }, (_, i) => addDays(today, offset * 14 + i)), [today, offset]);
  // Al abrir, deja seleccionado el primer día con horarios para que la pantalla nunca se vea vacía.
  useEffect(() => {
    if (!autoSelect || date) return;
    for (let i = 0; i < 90; i++) {
      const d = addDays(today, i);
      if (service.days.includes(dow(d)) && hasFree(d, service, db.appointments, db.blocks, db.services)) { setDate(d); break; }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSelect, serviceId]);
  const slots = date ? slotsFor(date, service, db.appointments, db.blocks, db.services, ignoreApptId) : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-display text-2xl font-extrabold uppercase">Elige el día</h4>
        <div className="flex gap-2">
          <button type="button" className="btn btn-outline btn-sm" disabled={offset === 0} onClick={() => setOffset(offset - 1)} aria-label="Semanas anteriores">←</button>
          <button type="button" className="btn btn-outline btn-sm" disabled={offset >= 5} onClick={() => setOffset(offset + 1)} aria-label="Semanas siguientes">→</button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((d) => {
          const free = service.days.includes(dow(d)) && hasFree(d, service, db.appointments, db.blocks, db.services);
          const sel = date === d;
          return (
            <button key={d} type="button" disabled={!free} onClick={() => { setDate(d); onChange(null); }}
              className={`rounded-2xl py-2.5 text-center border-2 transition ${sel ? "bg-ink text-white border-ink" : free ? "bg-white border-mist hover:border-brand" : "bg-slate-50 border-transparent text-slate-300 cursor-not-allowed"}`}
              aria-pressed={sel} aria-label={`${longDate(d)}${free ? "" : ", sin horarios"}`}>
              <div className="text-[.65rem] font-bold uppercase">{DAYS_SHORT[(dow(d) + 6) % 7]}</div>
              <div className="font-display text-2xl font-extrabold leading-none">{Number(d.slice(8))}</div>
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {!date ? (
          <p className="text-slate-500">Selecciona un día para ver los horarios disponibles.</p>
        ) : (
          <>
            <h4 className="font-display text-2xl font-extrabold uppercase mb-1">Horarios · <span>{longDate(date)}</span></h4>
            <p className="text-xs text-slate-500 mb-3">Duración: {service.duration} min · Hora de Saltillo · Los horarios tachados están ocupados.</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {slots.map((s) => {
                const sel = value?.date === date && value.time === s.time;
                return (
                  <button key={s.time} type="button" disabled={!s.free} onClick={() => onChange({ date, time: s.time })} aria-pressed={sel}
                    className={`rounded-xl py-2.5 text-sm font-bold border-2 transition ${sel ? "bg-amber border-amber text-ink" : s.free ? "bg-white border-mist hover:border-brand" : "bg-slate-50 border-transparent text-slate-300 line-through cursor-not-allowed"}`}>
                    {fmtTime(s.time)}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
