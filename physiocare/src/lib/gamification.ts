import { addDays, parse } from "./dates";
import { EXERCISES, type ClinicalRecord } from "./seed";

/** Ejercicios completados por día: fecha → ids de ejercicio. */
export type DayLog = Record<string, string[]>;

export const PER_DAY = EXERCISES.length;
export const STREAK_GOALS = [3, 7, 14, 30, 60];
export const EXERCISE_GOALS = [10, 25, 50, 100];

/** Historial de ejemplo, relativo a hoy: la demo siempre muestra una racha viva que termina ayer. */
const SEED: Record<string, { start: number; counts: number[] }> = {
  // counts: del día más antiguo al más reciente, terminando ayer
  p_ana: { start: -9, counts: [3, 3, 3, 2, 3, 3, 3, 3] }, // racha de 8 días, 23 ejercicios
  p_luis: { start: -6, counts: [3, 2, 3, 3, 3] }, // racha de 5 días
  p_carla: { start: -12, counts: [3, 0, 2, 3, 0, 0, 2, 3, 0, 3, 0] }, // constancia irregular
};

export function defaultLog(patientId: string, today: string): DayLog {
  const s = SEED[patientId];
  if (!s) return {};
  const log: DayLog = {};
  s.counts.forEach((n, i) => {
    const date = addDays(today, -(s.counts.length - i));
    if (n > 0) log[date] = EXERCISES.slice(0, n).map((e) => e.id);
  });
  return log;
}
export function defaultStart(patientId: string, today: string): string | null {
  const s = SEED[patientId];
  return s ? addDays(today, s.start) : null;
}

const daysBetween = (a: string, b: string) => Math.round((parse(b).getTime() - parse(a).getTime()) / 864e5);

export interface Stats {
  current: number;
  best: number;
  total: number;
  doneToday: number;
  /** % de ejercicios completados sobre los prescritos desde que inició el plan; null si aún no hay plan. */
  adherence: number | null;
}

export function stats(log: DayLog, start: string | null, today: string): Stats {
  const count = (d: string) => log[d]?.length ?? 0;
  const doneToday = count(today);

  // Racha actual: sigue viva si ayer se hizo algo, aunque hoy todavía no.
  let current = 0;
  let d = doneToday > 0 ? today : addDays(today, -1);
  while (count(d) > 0) { current++; d = addDays(d, -1); }

  // Mejor racha histórica
  const days = Object.keys(log).filter((k) => count(k) > 0).sort();
  let best = 0, run = 0, prev: string | null = null;
  for (const k of days) { run = prev && addDays(prev, 1) === k ? run + 1 : 1; best = Math.max(best, run); prev = k; }

  const total = Object.values(log).reduce((s, a) => s + a.length, 0);

  // Adherencia: ejercicios completados sobre los prescritos desde el inicio del plan.
  let adherence: number | null = null;
  const first = start ?? days[0] ?? null;
  if (first) {
    // Hoy entra en el cálculo solo cuando el día está completo: marcar un ejercicio nunca baja la adherencia.
    const end = doneToday >= PER_DAY ? today : addDays(today, -1);
    const n = daysBetween(first, end) + 1;
    if (n > 0) {
      const done = Object.entries(log).filter(([k]) => k >= first && k <= end).reduce((s, [, a]) => s + a.length, 0);
      adherence = Math.min(100, Math.round((done / (n * PER_DAY)) * 100));
    }
  }
  return { current, best, total, doneToday, adherence };
}

/** Metas ya alcanzadas y la próxima por alcanzar. */
export function milestones(s: Stats) {
  const achieved = [
    ...STREAK_GOALS.filter((g) => g <= s.best).map((g) => `Racha de ${g} días`),
    ...EXERCISE_GOALS.filter((g) => g <= s.total).map((g) => `${g} ejercicios completados`),
  ];
  const goal = STREAK_GOALS.find((g) => g > s.current);
  const next = goal ? { goal, remaining: goal - s.current, pct: Math.round((s.current / goal) * 100) } : null;
  return { achieved, next };
}

export interface RecordItem { title: string; value: string; detail: string }

/** Récords personales a partir de la evolución clínica de ejemplo: solo cuando la última sesión supera a todas las anteriores. */
export function records(ses: ClinicalRecord["sesiones"]): RecordItem[] {
  if (ses.length < 2) return [];
  const last = ses[ses.length - 1];
  const before = ses.slice(0, -1);
  const first = ses[0];
  const out: RecordItem[] = [];
  if (last.movilidad > Math.max(...before.map((s) => s.movilidad)))
    out.push({ title: "Nuevo récord de movilidad", value: `${last.movilidad} %`, detail: `+${last.movilidad - first.movilidad} puntos desde el inicio` });
  if (last.fuerza > Math.max(...before.map((s) => s.fuerza)))
    out.push({ title: "Nuevo récord de fuerza", value: `${last.fuerza} %`, detail: `+${last.fuerza - first.fuerza} puntos desde el inicio` });
  if (last.dolor < Math.min(...before.map((s) => s.dolor)))
    out.push({ title: "Dolor en su nivel más bajo", value: `${last.dolor}/10`, detail: `${first.dolor - last.dolor} puntos menos desde el inicio` });
  return out;
}
