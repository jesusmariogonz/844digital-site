export const TZ = "America/Monterrey"; // zona horaria de Saltillo, Coahuila

export function nowParts() {
  const f = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(new Date());
  const g = (t: string) => f.find((p) => p.type === t)!.value;
  const hh = g("hour") === "24" ? "00" : g("hour");
  return { date: `${g("year")}-${g("month")}-${g("day")}`, time: `${hh}:${g("minute")}` };
}
export const todayStr = () => nowParts().date;

export function parse(d: string) {
  const [y, m, dd] = d.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, dd));
}
export function fmtDate(d: Date) {
  return d.toISOString().slice(0, 10);
}
export function addDays(d: string, n: number) {
  const x = parse(d);
  x.setUTCDate(x.getUTCDate() + n);
  return fmtDate(x);
}
export function dow(d: string) {
  return parse(d).getUTCDay();
}
export function startOfWeek(d: string) {
  const w = (dow(d) + 6) % 7; // lunes=0
  return addDays(d, -w);
}
export function startOfMonth(d: string) {
  return d.slice(0, 8) + "01";
}
export function addMonths(d: string, n: number) {
  const x = parse(startOfMonth(d));
  x.setUTCMonth(x.getUTCMonth() + n);
  return fmtDate(x);
}
const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
export function longDate(d: string) {
  return cap(new Intl.DateTimeFormat("es-MX", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(parse(d)));
}
export function shortDate(d: string) {
  return cap(new Intl.DateTimeFormat("es-MX", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }).format(parse(d)));
}
export function monthName(d: string) {
  return new Intl.DateTimeFormat("es-MX", { month: "long", year: "numeric", timeZone: "UTC" }).format(parse(d));
}
export const DAYS_SHORT = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
export const fromMin = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
export const fmtTime = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  const ap = h >= 12 ? "p. m." : "a. m.";
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${ap}`;
};
export const money = (n: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);
export const uid = (p = "id") => `${p}_${Math.random().toString(36).slice(2, 9)}`;

// Horario de atención de la demo (editable en una versión productiva)
export const HOURS: Record<number, [number, number][]> = {
  0: [],
  1: [[9 * 60, 14 * 60], [15 * 60, 19 * 60]],
  2: [[9 * 60, 14 * 60], [15 * 60, 19 * 60]],
  3: [[9 * 60, 14 * 60], [15 * 60, 19 * 60]],
  4: [[9 * 60, 14 * 60], [15 * 60, 19 * 60]],
  5: [[9 * 60, 14 * 60], [15 * 60, 19 * 60]],
  6: [[9 * 60, 13 * 60]],
};
export const SLOT_STEP = 30;
