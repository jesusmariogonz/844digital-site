"use client";
import { useStore } from "@/lib/store";
import { addDays, dow, todayStr } from "@/lib/dates";
import { PER_DAY, defaultLog, defaultStart, milestones, records, stats } from "@/lib/gamification";
import { recordFor } from "@/lib/seed";
import { DemoOnly } from "./DemoUI";

const LETTERS = ["D", "L", "M", "M", "J", "V", "S"];

/** Constancia del paciente: racha, adherencia, meta siguiente y récords. Sin trofeos ni iconos: solo cifras. */
export function RecoveryStreak({ patientId }: { patientId: string }) {
  const { db } = useStore();
  const today = todayStr();
  const log = db.exLog?.[patientId] ?? defaultLog(patientId, today);
  const start = db.exStart?.[patientId] ?? defaultStart(patientId, today);
  const s = stats(log, start, today);
  const m = milestones(s);
  const recs = records(recordFor(patientId, today).sesiones);
  const week = Array.from({ length: 14 }, (_, i) => addDays(today, i - 13));

  const status =
    s.doneToday > 0
      ? `Hoy ya sumaste. Mañana puedes llegar a ${s.current + 1} días.`
      : s.current > 0
        ? "Completa un ejercicio hoy para mantener tu racha."
        : "Completa un ejercicio hoy para iniciar tu racha.";

  return (
    <section aria-labelledby="streak-t" className="space-y-4">
      <div className="bg-ink text-white grid lg:grid-cols-12">
        <div className="lg:col-span-4 p-6 sm:p-8 lg:border-r border-white/15">
          <p id="streak-t" className="eyebrow !text-amber">Recovery Streak</p>
          <div className="mt-5 flex items-end gap-3">
            <span className="font-display font-extrabold leading-[.78] text-[8rem] sm:text-[9.5rem] text-amber" aria-label={`${s.current} días consecutivos`}>{s.current}</span>
            <span className="font-display uppercase font-bold tracking-[.1em] text-xl pb-3 leading-tight">días<br />consecutivos</span>
          </div>
          <p className="mt-5 text-white/80">{status}</p>
          <p className="mt-2 font-display uppercase tracking-[.14em] text-sm text-white/55">Hoy: {s.doneToday} de {PER_DAY} ejercicios</p>
        </div>

        <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between gap-8">
          <div>
            <div className="font-display uppercase tracking-[.16em] text-sm text-white/60 mb-3">Últimos 14 días</div>
            <ol className="grid grid-cols-14 gap-1 sm:gap-1.5" style={{ gridTemplateColumns: "repeat(14, minmax(0, 1fr))" }} aria-label="Actividad de los últimos 14 días">
              {week.map((d) => {
                const n = log[d]?.length ?? 0;
                const isToday = d === today;
                const before = !!start && d < start;
                return (
                  <li key={d} className="text-center">
                    <div
                      title={`${d}: ${n} de ${PER_DAY}`}
                      aria-label={`${d}: ${n} de ${PER_DAY} ejercicios`}
                      className={`aspect-square ${n >= PER_DAY ? "bg-amber" : n > 0 ? "bg-amber/55" : isToday ? "border-2 border-amber" : before ? "bg-white/5" : "border border-white/25"}`}
                    />
                    <div className={`mt-1 font-display text-xs ${isToday ? "text-amber font-bold" : "text-white/45"}`}>{LETTERS[dow(d)]}</div>
                  </li>
                );
              })}
            </ol>
            <p className="mt-2 text-xs text-white/50">Color pleno: los {PER_DAY} ejercicios del día. Color medio: alguno. Contorno: sin actividad.</p>
          </div>

          <dl className="grid grid-cols-3 gap-4 border-t border-white/15 pt-6">
            <div><dt className="font-display uppercase tracking-[.14em] text-xs text-white/60">Ejercicios completados</dt><dd className="font-display font-extrabold text-5xl sm:text-6xl leading-none mt-2">{s.total}</dd></div>
            <div><dt className="font-display uppercase tracking-[.14em] text-xs text-white/60">Adherencia</dt><dd className="font-display font-extrabold text-5xl sm:text-6xl leading-none mt-2">{s.adherence ?? "—"}{s.adherence !== null && <span className="text-2xl text-white/60"> %</span>}</dd></div>
            <div><dt className="font-display uppercase tracking-[.14em] text-xs text-white/60">Mejor racha</dt><dd className="font-display font-extrabold text-5xl sm:text-6xl leading-none mt-2">{s.best}<span className="text-2xl text-white/60"> días</span></dd></div>
          </dl>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-4">
        {recs.length > 0 && (
          <div className="lg:col-span-7 card p-5">
            <h3 className="font-display text-2xl font-extrabold uppercase">Récords personales</h3>
            <ul className="mt-3 divide-y divide-mist">
              {recs.map((r) => (
                <li key={r.title} className="py-3 flex items-baseline justify-between gap-4 border-l-4 border-amber pl-4">
                  <div><div className="font-display text-xl font-bold uppercase tracking-wide">{r.title}</div><div className="text-sm text-slate-600">{r.detail}</div></div>
                  <div className="font-display font-extrabold text-4xl leading-none">{r.value}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className={`${recs.length > 0 ? "lg:col-span-5" : "lg:col-span-12"} card p-5`}>
          <h3 className="font-display text-2xl font-extrabold uppercase">Próxima meta</h3>
          {m.next ? (
            <>
              <p className="mt-2"><b className="font-display text-3xl">Racha de {m.next.goal} días</b></p>
              <div className="h-2 bg-mist mt-3" role="progressbar" aria-valuenow={m.next.pct} aria-valuemin={0} aria-valuemax={100} aria-label="Avance hacia la próxima meta"><div className="h-full bg-ink transition-all duration-700" style={{ width: `${m.next.pct}%` }} /></div>
              <p className="text-sm text-slate-600 mt-2">Te faltan {m.next.remaining} {m.next.remaining === 1 ? "día" : "días"}.</p>
            </>
          ) : <p className="mt-2 text-slate-600">Alcanzaste todas las metas de racha. Mantén el ritmo.</p>}
          {m.achieved.length > 0 && <p className="mt-4 text-sm text-slate-600"><b className="text-ink">Logros:</b> {m.achieved.join(" / ")}</p>}
        </div>
      </div>
      <DemoOnly><p className="text-xs text-slate-500">Historial de ejemplo con datos ficticios. La racha, la adherencia y las metas se calculan con los ejercicios que marques.</p></DemoOnly>
    </section>
  );
}
