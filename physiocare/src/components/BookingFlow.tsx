"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Modal, FlagBadge } from "./ui";
import { SlotPicker } from "./SlotPicker";
import { fmtTime, longDate, money } from "@/lib/dates";
import type { Appointment } from "@/lib/types";

const STEPS = ["Agenda", "Tu cuenta", "Tus datos", "Pago", "Listo"];
type PayOpt = "anticipo" | "total" | "consultorio";

export function BookingFlow() {
  const { db, ready, loginAs, createPatient, updatePatient, book, payAppt, setApptStatus } = useStore();
  const [step, setStep] = useState(0);
  const [serviceId, setServiceId] = useState<string>("s_eval");
  const [origin, setOrigin] = useState<"web" | "foro">("web");
  const [slot, setSlot] = useState<{ date: string; time: string } | null>(null);
  const [tab, setTab] = useState<"nueva" | "demo">("nueva");
  const [acct, setAcct] = useState({ name: "", email: "", phone: "", pass: "" });
  const [info, setInfo] = useState({ phone: "", reason: "", consent: false });
  const [payOpt, setPayOpt] = useState<PayOpt>("anticipo");
  const [gateway, setGateway] = useState<Appointment | null>(null);
  const [payFailed, setPayFailed] = useState(false);
  const [done, setDone] = useState<Appointment | null>(null);
  const [err, setErr] = useState("");

  // Parámetros de la URL (sin useSearchParams para que la pantalla pinte al instante)
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const s = q.get("servicio");
    if (s && db.services.some((x) => x.id === s && x.active)) setServiceId(s);
    if (q.get("origen") === "foro") setOrigin("foro");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const patient = db.session.role === "patient" ? db.patients.find((p) => p.id === db.session.patientId) : undefined;
  const active = db.services.filter((s) => s.active);
  const service = db.services.find((s) => s.id === serviceId) ?? active[0];
  useEffect(() => { if (patient) setInfo((i) => ({ ...i, phone: i.phone || patient.phone })); }, [patient]);

  const createAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (acct.pass.length < 6) return setErr("La contraseña debe tener al menos 6 caracteres.");
    if (db.patients.some((p) => p.email.toLowerCase() === acct.email.toLowerCase())) return setErr("Ese correo ya tiene cuenta en la demo. Usa otro o entra con la cuenta de demostración.");
    const p = createPatient({ name: acct.name, email: acct.email, phone: acct.phone });
    loginAs("patient", p.id);
    setInfo((i) => ({ ...i, phone: acct.phone }));
    setErr(""); setStep(2);
  };

  const confirm = () => {
    if (!patient || !service || !slot) return;
    if (patient.phone !== info.phone) updatePatient(patient.id, { phone: info.phone });
    const a = book({ patientId: patient.id, serviceId: service.id, date: slot.date, time: slot.time, reason: info.reason, source: origin });
    if (payOpt === "consultorio") { setDone(a); setStep(4); } else { setGateway(a); setPayFailed(false); }
  };
  const settle = (ok: boolean) => {
    if (!gateway) return;
    payAppt(gateway.id, payOpt === "total" ? "total" : "anticipo", ok);
    if (ok) { setApptStatus(gateway.id, "confirmada"); setDone({ ...gateway, status: "confirmada" }); setGateway(null); setStep(4); }
    else setPayFailed(true);
  };
  const skipPay = () => { if (gateway) { setDone(gateway); setGateway(null); setStep(4); } };

  const Summary = () => (
    <aside className="card p-5 lg:sticky lg:top-24" aria-label="Resumen de tu cita">
      <div className="text-xs font-bold uppercase tracking-wider text-brand">Tu valoración</div>
      <ul className="mt-3 space-y-3">
        {[
          ["Servicio", service ? service.name : null],
          ["Día", slot ? longDate(slot.date) : null],
          ["Horario", slot ? `${fmtTime(slot.time)} · ${service?.duration} min` : null],
          ["Precio", service ? money(service.price) : null],
        ].map(([k, v]) => (
          <li key={k as string} className="flex items-start gap-3">
            <span className={`mt-0.5 size-5 rounded-full grid place-items-center text-[.7rem] font-bold shrink-0 ${v && (k === "Servicio" || k === "Precio" || slot) ? "bg-emerald-500 text-white" : "bg-mist text-slate-400"}`}>{v && (k === "Servicio" || k === "Precio" || slot) ? "✓" : "·"}</span>
            <div><div className="text-xs uppercase font-bold text-slate-400">{k}</div><div className="font-semibold">{v && (k === "Servicio" || k === "Precio" || slot) ? v : "Por elegir"}</div></div>
          </li>
        ))}
      </ul>
      {step === 0 && (
        <button disabled={!slot} className="btn btn-primary w-full mt-5" onClick={() => setStep(patient ? 2 : 1)}>{slot ? "Continuar" : "Elige un horario"}</button>
      )}
      <p className="text-[.7rem] text-slate-500 mt-3">Hora de Saltillo. Simulación: nada se envía ni se cobra de verdad.</p>
    </aside>
  );

  return (
    <div className="container-x pt-10 sm:pt-12">
      <div className="eyebrow">Reservación en línea</div>
      <h1 className="section-title mt-2">Agenda tu valoración</h1>

      <ol className="flex gap-1.5 my-7" aria-label="Progreso">
        {STEPS.map((s, i) => (
          <li key={s} className="flex-1">
            <div className={`h-1.5 rounded-full ${i <= step ? "bg-brand" : "bg-mist"}`} />
            <div className={`text-[.65rem] sm:text-xs mt-1.5 font-bold uppercase tracking-wide ${i === step ? "text-ink" : "text-slate-400"}`}>{i + 1}. <span className="hidden sm:inline">{s}</span></div>
          </li>
        ))}
      </ol>

      <div className={`grid gap-6 items-start ${step < 4 ? "lg:grid-cols-3" : ""}`}>
        <div className={`card p-5 sm:p-8 reveal min-w-0 ${step < 4 ? "lg:col-span-2" : ""}`} key={step}>
          {step === 0 && (
            <div className="space-y-7">
              <div>
                <h2 className="font-display text-2xl font-extrabold uppercase mb-3">1. Elige el servicio</h2>
                <div className="scroll-x flex gap-2 pb-1" role="radiogroup" aria-label="Servicio">
                  {active.map((s) => (
                    <button key={s.id} role="radio" aria-checked={serviceId === s.id} onClick={() => { setServiceId(s.id); setSlot(null); }}
                      className={`shrink-0 text-left rounded-2xl border-2 px-4 py-3 transition ${serviceId === s.id ? "border-brand bg-brand/5" : "border-mist hover:border-brand/50"}`}>
                      <div className="font-bold leading-tight">{s.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{s.duration} min · {money(s.price)}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="font-display text-2xl font-extrabold uppercase mb-3">2. Elige día y horario <span className="ml-1 align-middle"><FlagBadge flag="demo" /></span></h2>
                {ready && service ? (
                  <SlotPicker key={service.id} serviceId={service.id} value={slot} onChange={setSlot} autoSelect />
                ) : (
                  <div className="animate-pulse space-y-3" aria-hidden="true"><div className="grid grid-cols-7 gap-2">{Array.from({ length: 7 }).map((_, i) => <div key={i} className="h-16 rounded-2xl bg-mist" />)}</div><div className="grid grid-cols-4 gap-2">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-11 rounded-xl bg-mist" />)}</div></div>
                )}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="font-display text-3xl font-extrabold uppercase mb-4">Inicia sesión o crea tu cuenta</h2>
              <div className="flex gap-2 mb-5">
                <button className={`btn btn-sm ${tab === "nueva" ? "btn-blue" : "btn-outline"}`} onClick={() => setTab("nueva")}>Crear cuenta</button>
                <button className={`btn btn-sm ${tab === "demo" ? "btn-blue" : "btn-outline"}`} onClick={() => setTab("demo")}>Ya tengo cuenta</button>
              </div>
              {tab === "nueva" ? (
                <form onSubmit={createAccount} className="grid sm:grid-cols-2 gap-3">
                  <div><label className="label" htmlFor="an">Nombre completo</label><input id="an" required className="input" value={acct.name} onChange={(e) => setAcct({ ...acct, name: e.target.value })} /></div>
                  <div><label className="label" htmlFor="ae">Correo</label><input id="ae" type="email" required className="input" value={acct.email} onChange={(e) => setAcct({ ...acct, email: e.target.value })} /></div>
                  <div><label className="label" htmlFor="ap">Teléfono / WhatsApp</label><input id="ap" type="tel" required className="input" value={acct.phone} onChange={(e) => setAcct({ ...acct, phone: e.target.value })} /></div>
                  <div><label className="label" htmlFor="apw">Contraseña</label><input id="apw" type="password" required className="input" value={acct.pass} onChange={(e) => setAcct({ ...acct, pass: e.target.value })} /></div>
                  {err && <p className="sm:col-span-2 text-red-600 text-sm font-semibold">{err}</p>}
                  <p className="sm:col-span-2 text-xs text-slate-500">Demo: la cuenta vive solo en este navegador y la contraseña no se guarda.</p>
                  <div className="sm:col-span-2 flex justify-between"><button type="button" className="btn btn-outline" onClick={() => setStep(0)}>Atrás</button><button className="btn btn-primary">Crear cuenta y continuar</button></div>
                </form>
              ) : (
                <div>
                  <div className="rounded-2xl border-2 border-dashed border-amber bg-amber/10 p-5">
                    <span className="chip bg-amber text-ink">Acceso de demostración</span>
                    <p className="mt-2 text-sm">Entra con la cuenta ficticia <b>Ana Ramírez</b> para recorrer la experiencia del paciente. No es una cuenta real.</p>
                    <button className="btn btn-primary mt-3" onClick={() => { loginAs("patient", "p_ana"); setStep(2); }}>Entrar como paciente demo</button>
                  </div>
                  <div className="mt-5"><button className="btn btn-outline" onClick={() => setStep(0)}>Atrás</button></div>
                </div>
              )}
            </div>
          )}

          {step === 2 && patient && (
            <div>
              <h2 className="font-display text-3xl font-extrabold uppercase mb-4">Tus datos</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <div><label className="label">Nombre</label><input className="input bg-slate-50" value={patient.name} readOnly /></div>
                <div><label className="label">Correo</label><input className="input bg-slate-50" value={patient.email} readOnly /></div>
                <div><label className="label" htmlFor="ph">Teléfono / WhatsApp</label><input id="ph" type="tel" required className="input" value={info.phone} onChange={(e) => setInfo({ ...info, phone: e.target.value })} /></div>
                <div className="sm:col-span-2"><label className="label" htmlFor="re">Motivo de consulta (opcional)</label><textarea id="re" rows={3} className="input" placeholder="¿Qué te molesta o qué objetivo tienes?" value={info.reason} onChange={(e) => setInfo({ ...info, reason: e.target.value })} /></div>
              </div>
              <label className="flex gap-2 text-sm text-slate-600 mt-4"><input type="checkbox" className="mt-1" checked={info.consent} onChange={(e) => setInfo({ ...info, consent: e.target.checked })} /> Acepto el aviso de privacidad (ejemplo) y el tratamiento de mis datos para gestionar mi cita.</label>
              <div className="mt-6 flex justify-between"><button className="btn btn-outline" onClick={() => setStep(0)}>Atrás</button><button className="btn btn-primary" disabled={!info.consent || !info.phone} onClick={() => setStep(3)}>Continuar</button></div>
            </div>
          )}

          {step === 3 && patient && service && slot && (
            <div>
              <h2 className="font-display text-3xl font-extrabold uppercase mb-4">¿Cómo quieres pagar?</h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {([["anticipo", `Anticipo ${money(service.deposit)}`, "Aparta tu horario"], ["total", `Pagar ${money(service.price)}`, "Pago completo"], ["consultorio", "Pagar en consultorio", "Sin pago ahora"]] as [PayOpt, string, string][]).map(([k, t, d]) => (
                  <button key={k} onClick={() => setPayOpt(k)} aria-pressed={payOpt === k} className={`text-left p-4 rounded-2xl border-2 ${payOpt === k ? "border-brand bg-brand/5" : "border-mist"}`}>
                    <div className="font-bold">{t}</div><div className="text-sm text-slate-500">{d}</div>
                  </button>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2"><FlagBadge flag="demo" /><FlagBadge flag="pendiente" /></div>
              <p className="text-xs text-slate-500 mt-2">El pago es simulado. No se piden ni se guardan datos de tarjeta. Reembolsos sujetos a la política del consultorio.</p>
              <div className="mt-6 flex justify-between"><button className="btn btn-outline" onClick={() => setStep(2)}>Atrás</button><button className="btn btn-primary" onClick={confirm}>Confirmar cita</button></div>
            </div>
          )}

          {step === 4 && done && service && (
            <div className="text-center py-4">
              <div className="size-20 rounded-full bg-emerald-100 text-emerald-600 grid place-items-center mx-auto text-4xl font-bold">✓</div>
              <h2 className="font-display text-5xl font-extrabold uppercase mt-4">Tu cita está {done.status === "confirmada" ? "confirmada" : "solicitada"}</h2>
              <p className="mt-2 text-lg">{service.name} · {longDate(done.date)} · {fmtTime(done.time)}</p>
              <div className="mt-6 grid sm:grid-cols-2 gap-3 text-left max-w-2xl mx-auto">
                <div className="rounded-2xl bg-slate-50 p-4 text-sm"><b>Correo (simulado)</b><br />Enviamos el detalle de tu cita a {patient?.email}.</div>
                <div className="rounded-2xl bg-slate-50 p-4 text-sm"><b>WhatsApp (simulado)</b><br />Recibirás recordatorios 24 horas antes y el mismo día.</div>
              </div>
              <div className="mt-8 flex flex-wrap gap-3 justify-center">
                <Link href="/cuenta" className="btn btn-primary">Ver mi recuperación</Link>
                <Link href="/ingresar?admin=1" className="btn btn-blue">Ver cómo le llega a Erik →</Link>
              </div>
              <p className="text-xs text-slate-500 mt-4">Demo: la cita ya aparece en la agenda del panel del fisioterapeuta.</p>
            </div>
          )}
        </div>
        {step < 4 && <Summary />}
      </div>

      <Modal open={!!gateway} onClose={() => setGateway(null)} title="Pasarela de pago (demo)">
        {gateway && service && (
          <div>
            <p className="text-sm text-slate-600">Simulación de Stripe / Mercado Pago. <b>No se capturan datos de tarjeta.</b></p>
            <div className="rounded-2xl bg-slate-50 p-4 my-4 flex justify-between items-center"><span>{payOpt === "total" ? "Consulta" : "Anticipo"} · {service.name}</span><b className="font-display text-3xl">{money(payOpt === "total" ? service.price : service.deposit)}</b></div>
            {payFailed && <p className="rounded-xl bg-red-50 text-red-700 p-3 text-sm mb-3">Pago rechazado (simulado). Puedes reintentar o pagar en el consultorio.</p>}
            <div className="grid gap-2">
              <button className="btn btn-primary" onClick={() => settle(true)}>Simular pago exitoso</button>
              <button className="btn btn-danger" onClick={() => settle(false)}>Simular pago rechazado</button>
              <button className="btn btn-outline" onClick={skipPay}>Pagar en consultorio</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
