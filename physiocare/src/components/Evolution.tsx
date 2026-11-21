import type { ClinicalRecord } from "@/lib/seed";
import { shortDate } from "@/lib/dates";

type S = ClinicalRecord["sesiones"];
const METRICS = [
  { k: "dolor" as const, label: "Dolor", color: "#ef4444", max: 10, unit: "/10", better: "menos" },
  { k: "movilidad" as const, label: "Movilidad", color: "#2f6bff", max: 100, unit: "%", better: "más" },
  { k: "fuerza" as const, label: "Fuerza", color: "#19b37a", max: 100, unit: "%", better: "más" },
];

/** Barras de evolución actual + gráfica de líneas por sesión. Datos ficticios en la demo. */
export function Evolution({ sesiones, compact }: { sesiones: S; compact?: boolean }) {
  if (!sesiones.length) return null;
  const last = sesiones[sesiones.length - 1];
  const first = sesiones[0];
  const W = 520, H = 170, PADX = 28, PADY = 14;
  const x = (i: number) => PADX + (sesiones.length === 1 ? (W - 2 * PADX) / 2 : (i * (W - 2 * PADX)) / (sesiones.length - 1));
  const y = (v: number) => H - PADY - (v / 100) * (H - 2 * PADY);

  return (
    <div>
      <div className="space-y-4">
        {METRICS.map((m) => {
          const v = last[m.k], pct = (v / m.max) * 100;
          const delta = v - first[m.k];
          return (
            <div key={m.k}>
              <div className="flex justify-between text-sm font-semibold"><span>{m.label}</span><span>{v}{m.unit}{sesiones.length > 1 && <span className="ml-2 text-xs text-slate-500">{delta > 0 ? "+" : ""}{delta} desde el inicio</span>}</span></div>
              <div className="h-3 rounded-full bg-mist mt-1 overflow-hidden" role="img" aria-label={`${m.label}: ${v}${m.unit}`}>
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, background: m.color }} />
              </div>
            </div>
          );
        })}
      </div>
      {!compact && sesiones.length > 1 && (
        <div className="mt-6">
          <svg viewBox={`0 0 ${W} ${H + 22}`} className="w-full" role="img" aria-label="Gráfica de evolución por sesión">
            {[0, 50, 100].map((g) => <g key={g}><line x1={PADX} x2={W - PADX} y1={y(g)} y2={y(g)} stroke="#e6ecf6" /><text x={2} y={y(g) + 4} fontSize="10" fill="#94a3b8">{g}</text></g>)}
            {METRICS.map((m) => {
              const pts = sesiones.map((s, i) => `${x(i)},${y((s[m.k] / m.max) * 100)}`).join(" ");
              return (
                <g key={m.k}>
                  <polyline points={pts} fill="none" stroke={m.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  {sesiones.map((s, i) => <circle key={i} cx={x(i)} cy={y((s[m.k] / m.max) * 100)} r="4" fill="#fff" stroke={m.color} strokeWidth="2.5" />)}
                </g>
              );
            })}
            {sesiones.map((s, i) => <text key={i} x={x(i)} y={H + 14} fontSize="10" textAnchor="middle" fill="#64748b">{shortDate(s.fecha).replace(/\./g, "")}</text>)}
          </svg>
          <div className="flex gap-4 text-xs text-slate-600 justify-center">{METRICS.map((m) => <span key={m.k}><i className="inline-block size-2.5 rounded-full mr-1" style={{ background: m.color }} />{m.label}{m.k === "dolor" ? " (escala 0–10 ×10)" : ""}</span>)}</div>
        </div>
      )}
    </div>
  );
}
