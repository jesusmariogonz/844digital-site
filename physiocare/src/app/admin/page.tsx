"use client";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { PageHead, PayChip, Stat, StatusChip, Empty } from "@/components/ui";
import { addDays, fmtTime, money, shortDate, todayStr } from "@/lib/dates";

export default function Resumen() {
  const { db, setApptStatus } = useStore();
  const today = todayStr();
  const month = today.slice(0, 7);
  const svc = (id: string) => db.services.find((s) => s.id === id);
  const pat = (id: string) => db.patients.find((p) => p.id === id);
  const sorted = [...db.appointments].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const todayList = sorted.filter((a) => a.date === today && a.status !== "cancelada");
  const upcoming = sorted.filter((a) => a.date > today && (a.status === "pendiente" || a.status === "confirmada")).slice(0, 5);
  const pending = sorted.filter((a) => a.status === "pendiente" && a.date >= today);
  const cancels = db.appointments.filter((a) => a.status === "cancelada").length;
  const income = db.payments.filter((p) => p.status === "aprobado" && p.date.startsWith(month)).reduce((s, p) => s + p.amount, 0);
  const forum = db.appointments.filter((a) => a.source === "foro").length;
  const web = db.appointments.filter((a) => a.source === "web").length;
  const manual = db.appointments.filter((a) => a.source === "manual").length;

  const weeks = [3, 2, 1, 0].map((w) => {
    const to = addDays(today, -7 * w), from = addDays(to, -6);
    return { label: shortDate(from).replace(/\./g, ""), total: db.payments.filter((p) => p.status === "aprobado" && p.date >= from && p.date <= to).reduce((s, p) => s + p.amount, 0) };
  });
  const max = Math.max(1, ...weeks.map((w) => w.total));

  return (
    <>
      <PageHead title="Resumen" sub="Lo importante de tu consultorio hoy." flag="demo">
        <Link href="/admin/agenda" className="btn btn-primary">Abrir agenda</Link>
      </PageHead>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Stat accent label="Citas de hoy" value={todayList.length} />
        <Stat label="Próximas" value={upcoming.length} hint="siguientes días" />
        <Stat label="Pacientes" value={db.patients.length} />
        <Stat label="Ingresos del mes" value={money(income)} hint="pagos aprobados" />
        <Stat label="Por confirmar" value={pending.length} />
        <Stat label="Cancelaciones" value={cancels} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <section className="card p-5 lg:col-span-2">
          <h2 className="font-display text-3xl font-extrabold uppercase mb-3">Agenda de hoy</h2>
          {todayList.length ? (
            <div className="divide-y divide-mist">
              {todayList.map((a) => (
                <div key={a.id} className="py-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-4"><div className="font-display text-3xl font-extrabold w-24">{fmtTime(a.time)}</div><div><b>{pat(a.patientId)?.name}</b><div className="text-sm text-slate-500">{svc(a.serviceId)?.name}{a.reason ? ` · ${a.reason}` : ""}</div></div></div>
                  <div className="flex items-center gap-2"><StatusChip s={a.status} /><PayChip s={a.pay} /></div>
                </div>
              ))}
            </div>
          ) : <Empty>Sin citas para hoy.</Empty>}
        </section>
        <section className="card p-5">
          <h2 className="font-display text-3xl font-extrabold uppercase mb-3">Por confirmar</h2>
          {pending.length ? pending.slice(0, 5).map((a) => (
            <div key={a.id} className="py-3 border-b border-mist last:border-0">
              <div className="font-semibold">{pat(a.patientId)?.name}</div>
              <div className="text-sm text-slate-500">{svc(a.serviceId)?.name} · {shortDate(a.date)} {fmtTime(a.time)}</div>
              <div className="mt-2 flex gap-2"><button className="btn btn-blue btn-sm" onClick={() => setApptStatus(a.id, "confirmada")}>Confirmar</button></div>
            </div>
          )) : <Empty>Todo confirmado ✓</Empty>}
        </section>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <section className="card p-5 lg:col-span-2">
          <h2 className="font-display text-3xl font-extrabold uppercase mb-4">Ingresos · últimas 4 semanas</h2>
          <div className="flex items-end gap-4 h-44" role="img" aria-label="Gráfica de ingresos semanales">
            {weeks.map((w) => (
              <div key={w.label} className="flex-1 flex flex-col items-center justify-end h-full">
                <div className="text-sm font-bold mb-1">{money(w.total)}</div>
                <div className="w-full rounded-t-xl bg-brand" style={{ height: `${Math.max(4, (w.total / max) * 100)}%` }} />
                <div className="text-xs text-slate-500 mt-2">{w.label}</div>
              </div>
            ))}
          </div>
        </section>
        <section className="card p-5">
          <h2 className="font-display text-3xl font-extrabold uppercase mb-3">Origen de citas</h2>
          {[["Sitio web", web], ["Foro “Pregúntale a Erik”", forum], ["Alta manual", manual]].map(([l, n]) => (
            <div key={String(l)} className="flex justify-between py-2 border-b border-mist last:border-0"><span>{l}</span><b>{n}</b></div>
          ))}
          <Link href="/admin/preguntas" className="btn btn-outline btn-sm mt-4">Preguntas pendientes: {db.questions.filter((q) => q.status === "pendiente").length}</Link>
        </section>
      </div>
    </>
  );
}
