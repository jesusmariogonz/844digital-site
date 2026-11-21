"use client";
import { useStore } from "@/lib/store";
import { FlagBadge, PageHead, Stat } from "@/components/ui";
import { money, todayStr } from "@/lib/dates";

const STATES: [string, string, string][] = [
  ["Pendiente", "El paciente inició la reservación", "bg-slate-200 text-slate-700"],
  ["Anticipo / Pagado", "La pasarela confirma el cobro", "bg-emerald-100 text-emerald-800"],
  ["Rechazado", "El banco o la pasarela no aprueba", "bg-red-100 text-red-700"],
  ["Reembolsado", "Cancelación con devolución según política", "bg-violet-100 text-violet-800"],
];

export default function Pagos() {
  const { db, refund } = useStore();
  const month = todayStr().slice(0, 7);
  const ok = db.payments.filter((p) => p.status === "aprobado");
  const income = ok.filter((p) => p.date.startsWith(month)).reduce((s, p) => s + p.amount, 0);
  const refunded = db.payments.filter((p) => p.status === "reembolsado").reduce((s, p) => s + p.amount, 0);
  const pendingCollect = db.appointments.filter((a) => (a.pay === "sin_pago" || a.pay === "anticipo") && (a.status === "confirmada" || a.status === "pendiente")).length;
  return (
    <>
      <PageHead title="Pagos" sub="Historial de transacciones y estados. Los cobros de esta demo son simulados: no existe conexión con Stripe ni Mercado Pago." flag="pendiente" />
      <div className="grid sm:grid-cols-3 gap-4"><Stat accent label="Cobrado este mes" value={money(income)} /><Stat label="Reembolsado" value={money(refunded)} /><Stat label="Citas con saldo pendiente" value={pendingCollect} /></div>

      <section className="card p-5 mt-6">
        <h2 className="font-display text-3xl font-extrabold uppercase mb-3">Flujo y estados de pago</h2>
        <div className="grid md:grid-cols-4 gap-3">{STATES.map(([t, d, c], i) => <div key={t} className="rounded-2xl border border-mist p-4 relative"><span className={`chip ${c}`}>{i + 1}. {t}</span><p className="text-sm text-slate-600 mt-2">{d}</p></div>)}</div>
        <div className="mt-3 flex flex-wrap gap-2"><FlagBadge flag="pendiente" /><span className="text-xs text-slate-500 self-center">Integración futura: Mercado Pago o Stripe. Nunca se almacenan datos de tarjeta: los procesa la pasarela.</span></div>
      </section>

      <section className="card overflow-hidden mt-6">
        <div className="hidden md:grid grid-cols-12 bg-ink text-white text-xs font-bold uppercase tracking-wider p-4"><div className="col-span-3">Paciente</div><div className="col-span-2">Concepto</div><div className="col-span-2">Fecha</div><div className="col-span-2">Método</div><div className="col-span-1">Monto</div><div className="col-span-2">Estado</div></div>
        {db.payments.map((p) => (
          <div key={p.id} className="grid md:grid-cols-12 gap-1 md:gap-3 p-4 border-b border-mist last:border-0 items-center text-sm">
            <div className="md:col-span-3 font-semibold">{db.patients.find((x) => x.id === p.patientId)?.name}</div>
            <div className="md:col-span-2">{p.concept}</div><div className="md:col-span-2">{p.date}</div><div className="md:col-span-2">{p.method}</div>
            <div className="md:col-span-1 font-bold">{money(p.amount)}</div>
            <div className="md:col-span-2 flex items-center gap-2"><span className={`chip ${p.status === "aprobado" ? "bg-emerald-100 text-emerald-800" : p.status === "reembolsado" ? "bg-violet-100 text-violet-800" : "bg-red-100 text-red-700"}`}>{p.status}</span>
              {p.status === "aprobado" && <button className="text-xs font-bold text-brand underline" onClick={() => confirm("¿Reembolsar (simulado) según política del consultorio?") && refund(p.apptId)}>Reembolsar</button>}</div>
          </div>
        ))}
      </section>
    </>
  );
}
