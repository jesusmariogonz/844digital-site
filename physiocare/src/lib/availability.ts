import type { Appointment, Block, Service } from "./types";
import { HOURS, SLOT_STEP, dow, fromMin, nowParts, toMin } from "./dates";

export interface Slot { time: string; free: boolean }

/** Horarios (libres y ocupados) para un servicio en una fecha. Hora de Saltillo. */
export function slotsFor(
  date: string,
  service: Service,
  appts: Appointment[],
  blocks: Block[],
  services: Service[],
  ignoreApptId?: string,
): Slot[] {
  const day = dow(date);
  if (!service.days.includes(day)) return [];
  const windows = HOURS[day] ?? [];
  const busy: [number, number][] = [];
  for (const a of appts) {
    if (a.date !== date || a.status === "cancelada" || a.id === ignoreApptId) continue;
    const dur = services.find((s) => s.id === a.serviceId)?.duration ?? 60;
    busy.push([toMin(a.time), toMin(a.time) + dur]);
  }
  for (const b of blocks) if (b.date === date) busy.push([toMin(b.start), toMin(b.end)]);

  const now = nowParts();
  const minStart = date === now.date ? toMin(now.time) + 60 : date < now.date ? Infinity : -1;

  const out: Slot[] = [];
  for (const [ws, we] of windows) {
    for (let t = ws; t + service.duration <= we; t += SLOT_STEP) {
      const end = t + service.duration;
      const overlaps = busy.some(([bs, be]) => t < be && end > bs);
      out.push({ time: fromMin(t), free: !overlaps && t >= minStart });
    }
  }
  return out;
}

export function hasFree(date: string, service: Service, a: Appointment[], b: Block[], s: Service[]) {
  return slotsFor(date, service, a, b, s).some((x) => x.free);
}
