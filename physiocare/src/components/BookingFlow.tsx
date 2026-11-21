"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { Modal, FlagBadge, Img } from "./ui";
import { SlotPicker } from "./SlotPicker";
import { SectionHead } from "./cards";
import { fmtTime, longDate, money } from "@/lib/dates";
import type { Appointment } from "@/lib/types";

const STEPS = ["Servicio", "Fecha y hora", "Tu cuenta", "Tus datos", "Pago", "Listo"];
type PayOpt = "anticipo" | "total" | "consultorio";

export function BookingFlow() {
  const sp = useSearchParams();
  const { db, loginAs, createPatient, updatePatient, book, payAppt, setApptStatus } = useStore();
  const [step, setStep] = useState(0);
  const [serviceId, setServiceId] = useState<string>("");
  const [slot, setSlot] = useState<{ date: string; time: string } | null>(null);
  const [tab, setTab] = useState<"nueva" | "demo">("nueva");
  const [acct, setAcct] = useState({ name: "", email: "", phone: "", pass: "" });
  const [info, setInfo] = useState({ phone: "", reason: "", consent: false });
  const [payOpt, setPayOpt] = useState<PayOpt>("anticipo");
  const [gateway, setGateway] = useState<Appointment | null>(null);
  const [payFailed, setPayFailed] = useState(false);
  const [done, setDone] = useState<Appointment | null>(null);
  const [err, setErr] = useState("");

  const origin = sp.get("origen") === "foro" ? "foro" : "web";
  useEffect(() => {
    const s = sp.get("servicio");
    if (s && db.services.some((x) => x.id === s && x.active)) { setServiceId(s); setStep(1); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp, db.services.length]);

  const patient = db.session.role === "patient" ? db.patients.find((p) => p.id === db.session.patientId) : undefined;
  const service = db.services.find((s) => s.id === serviceId);

  useEffect(() => { if (patient) setInfo((i) => ({ ...i, phone: i.phone || patient.phone })); }, [patient]);

  const createAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (acct.pass.length < 6) return setErr("La contraseña debe tener al menos 6 caracteres.");
    const exists = db.patients.find((p) => p.email.toLowerCase() === acct.email.toLowerCase());
    if (exists) return setErr("Ese correo ya tiene cuenta en la demo. Usa otro o entra con la cuenta de demostración.");
    const p = createPatient({ name: acct.name, email: acct.email, phone: acct.phone });
    loginAs("patient", p.id);
    setInfo((i) => ({ ...i, phone: acct.phone }));
    setErr(""); setStep(3);
  };

  const confirm = () => {
    if (!patient || !service || !slot) return;
    if (patient.phone !== info.phone) updatePatient(patient.id, { phone: info.phone });
    const a = book({ patientId: patient.id, serviceId: service.id, date: slot.date, time: slot.time, reason: info.reason, source: origin });
    if (payOpt === "consultorio") { setDone(a); setStep(5); } else { setGateway(a); setPayFailed(false); }
  };
  const settle = (ok: boolean) => {
    if (!gateway) return;
    payAppt(gateway.id, payOpt === "total" ? "total" : "anticipo", ok);
    if (ok) { setApptStatus(gateway.id, "confirmada"); setDone({ ...gateway, status: "confirmada" }); setGateway(null); setStep(5); }
    else setPayFailed(true);
  };
  const skipPay = () => { if (gateway) { setDone(gateway); setGateway(null); setStep(5); } };

  return (
    <div className="container-x pt-12 max-w-4xl">
      <SectionHead h1 eyebrow="Reservación en línea" title="Agenda tu cita">En pocos pasos. Esta es una simulación: nada se envía ni se cobra de verdad.</SectionHead>

      <ol className="flex gap-1.5 mb-8" aria-label="Progreso">
        {STEPS.map((s, i) => (
          <li key={s} className="flex-1">
            <div className={`h-1.5 rounded-full ${i <= step ? "bg-brand" : "bg-mist"}`} />
            <div className={`text-[.65rem] sm:text-xs mt-1.5 font-bold uppercase tracking-wide ${i === step ? "text-ink" : "text-slate-400"}`}>{i + 1}. <span className="hidden sm:inline">{s}</span></div>
          </li>
        ))}
      </ol>

      <div className="card p-5 sm:p-8 reveal" key={step}>
        {step === 0 && (
          <div>
            <h3 className="font-display text-3xl font-extrabold uppercase mb-4">¿Qué servicio necesitas?</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {db.services.filter((s) => s.active).map((s) => (
                <button key={s.id} onClick={() => { setServiceId(s.id); setSlot(null); setStep(1); }} className={`text-left flex gap-3 p-3 rounded-2xl border-2 transition hover:border-brand ${serviceId === s.id ? "border-brand bg-brand/5" : "border-mist"}`}>
                  <div className="size-20 rounded-xl overflow-hidden shrink-0"><Img src={s.image} alt="" /></div>
                  <div><div className="font-display text-xl font-extrabold uppercase leading-none">{s.name}</div><div className="text-sm text-slate-500 mt-1">{s.duration} min · {money(s.price)}</div></div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && service && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
              <div><span className="chip bg-brand/10 text-brand">{service.name}</span> <button className="text-sm font-bold underline ml-1" onClick={() => setStep(0)}>Cambiar</button></div>
              <FlagBadge flag="demo" />
            </div>
            <SlotPicker serviceId={service.id} value={slot} onChange={setSlot} />
            <div className="mt-8 flex justify-between"><button className="btn btn-outline" onClick={() => setStep(0)}>Atrás</button><button disabled={!slot} className="btn btn-primary" onClick={() => setStep(patient ? 3 : 2)}>Continuar</button></div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="font-display text-3xl font-extrabold uppercase mb-4">Inicia sesión o crea tu cuenta</h3>
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
                <div className="sm:col-span-2 flex justify-between"><button type="button" className="btn btn-outline" onClick={() => setStep(1)}>Atrás</button><button className="btn btn-primary">Crear cuenta y continuar</button></div>
              </form>
            ) : (
              <div>
                <div className="rounded-2xl border-2 border-dashed border-amber bg-amber/10 p-5">
                  <span className="chip bg-amber text-ink">Acceso de demostración</span>
                  <p className="mt-2 text-sm">Entra con la cuenta ficticia <b>Ana Ramírez</b> para recorrer la experiencia del paciente. No es una cuenta real.</p>
                  <button className="btn btn-primary mt-3" onClick={() => { loginAs("patient", "p_ana"); setStep(3); }}>Entrar como paciente demo</button>
                </div>
                <div className="mt-5"><button className="btn btn-outline" onClick={() => setStep(1)}>Atrás</button></div>
              </div>
            )}
          </div>
        )}

        {step === 3 && patient && (
          <div>
            <h3 className="font-display text-3xl font-extrabold uppercase mb-4">Tus datos</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <div><label className="label">Nombre</label><input className="input bg-slate-50" value={patient.name} readOnly /></div>
              <div><label className="label">Correo</label><input className="input bg-slate-50" value={patient.email} readOnly /></div>
              <div><label className="label" htmlFor="ph">Teléfono / WhatsApp</label><input id="ph" type="tel" required className="input" value={info.phone} onChange={(e) => setInfo({ ...info, phone: e.target.value })} /></div>
              <div className="sm:col-span-2"><label className="label" htmlFor="re">Motivo de consulta (opcional)</label><textarea id="re" rows={3} className="input" placeholder="¿Qué te molesta o qué objetivo tienes?" value={info.reason} onChange={(e) => setInfo({ ...info, reason: e.target.value })} /></div>
            </div>
            <label className="flex gap-2 text-sm text-slate-600 mt-4"><input type="checkbox" className="mt-1" checked={info.consent} onChange={(e) => setInfo({ ...info, consent: e.target.checked })} /> Acepto el aviso de privacidad (ejemplo) y el tratamiento de mis datos para gestionar mi cita.</label>
            <div className="mt-6 flex justify-between"><button className="btn btn-outline" onClick={() => setStep(1)}>Atrás</button><button className="btn btn-primary" disabled={!info.consent || !info.phone} onClick={() => setStep(4)}>Continuar</button></div>
          </div>
        )}

        {step === 4 && patient && service && slot && (
          <div>
            <h3 className="font-display text-3xl font-extrabold uppercase mb-4">Revisa y confirma</h3>
            <div className="rounded-2xl bg-ink text-white p-5 grid sm:grid-cols-3 gap-4">
              <div><div className="text-xs text-amber font-bold uppercase">Servicio</div><div className="font-display text-2xl font-extrabold uppercase leading-none mt-1">{service.name}</div></div>
              <div><div className="text-xs text-amber font-bold uppercase">Cuándo</div><div className="font-semibold mt-1">{longDate(slot.date)}<br />{fmtTime(slot.time)} · {service.duration} min</div></div>
              <div><div className="text-xs text-amber font-bold uppercase">Paciente</div><div className="font-semibold mt-1">{patient.name}</div></div>
            </div>
            <h4 className="font-display text-2xl font-extrabold uppercase mt-6 mb-2">¿Cómo quieres pagar?</h4>
            <div className="grid sm:grid-cols-3 gap-3">
              {([["anticipo", `Anticipo ${money(service.deposit)}`, "Aparta tu horario"], ["total", `Pagar ${money(service.price)}`, "Pago completo"], ["consultorio", "Pagar en consultorio", "Sin pago ahora"]] as [PayOpt, string, string][]).map(([k, t, d]) => (
                <button key={k} onClick={() => setPayOpt(k)} aria-pressed={payOpt === k} className={`text-left p-4 rounded-2xl border-2 ${payOpt === k ? "border-brand bg-brand/5" : "border-mist"}`}>
                  <div className="font-bold">{t}</div><div className="text-sm text-slate-500">{d}</div>
                </button>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-2"><FlagBadge flag="demo" /><FlagBadge flag="pendiente" /></div>
            <p className="text-xs text-slate-500 mt-2">El pago es simulado. No se piden ni se guardan datos de tarjeta. Reembolsos sujetos a la política del consultorio.</p>
            <div className="mt-6 flex justify-between"><button className="btn btn-outline" onClick={() => setStep(3)}>Atrás</button><button className="btn btn-primary" onClick={confirm}>Confirmar cita</button></div>
          </div>
        )}

        {step === 5 && done && service && (
          <div className="text-center py-4">
            <div className="size-20 rounded-full bg-emerald-100 text-emerald-600 grid place-items-center mx-auto text-4xl font-bold">✓</div>
            <h3 className="font-display text-5xl font-extrabold uppercase mt-4">¡Cita {done.status === "confirmada" ? "confirmada" : "solicitada"}!</h3>
            <p className="mt-2 text-lg">{service.name} · {longDate(done.date)} · {fmtTime(done.time)}</p>
            <div className="mt-6 grid sm:grid-cols-2 gap-3 text-left max-w-2xl mx-auto">
              <div className="rounded-2xl bg-slate-50 p-4 text-sm"><b>Correo (simulado)</b><br />Enviamos el detalle de tu cita a {patient?.email}.</div>
              <div className="rounded-2xl bg-slate-50 p-4 text-sm"><b>WhatsApp (simulado)</b><br />Recibirás recordatorios 24 horas antes y el mismo día.</div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link href="/cuenta" className="btn btn-primary">Ver mis citas</Link>
              <Link href="/ingresar?admin=1" className="btn btn-blue">Ver cómo le llega a Erik →</Link>
            </div>
            <p className="text-xs text-slate-500 mt-4">Demo: la cita ya aparece en la agenda del panel del fisioterapeuta.</p>
          </div>
        )}
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
