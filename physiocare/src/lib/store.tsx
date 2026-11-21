"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Appointment, ApptStatus, Audience, Block, ContentItem, DB, MediaFile, Notice, NotifEvent, NotifSettings, Patient, PayStatus, Question, Service } from "./types";
import { BRAND, makeSeed } from "./seed";
import { addDays, fmtTime, longDate, todayStr, uid } from "./dates";
import { DEFAULT_SETTINGS, EVENTS, plan, render, SAMPLE, type Vars } from "./notifications";

const KEY = "efr-demo-v3"; // v3: rediseño editorial (imágenes de servicios)
const SKEY = "efr-session-v1"; // la sesión es por pestaña (sessionStorage): paciente y Erik pueden estar abiertos a la vez
const GUEST = { role: "guest" } as const;

export interface BookInput {
  patientId: string;
  serviceId: string;
  date: string;
  time: string;
  reason?: string;
  source?: Appointment["source"];
  pay?: PayStatus;
  manual?: boolean;
}

interface Ctx {
  db: DB;
  ready: boolean;
  loginAs: (role: "patient" | "admin", patientId?: string) => void;
  logout: () => void;
  createPatient: (p: Omit<Patient, "id" | "createdAt" | "demo">) => Patient;
  updatePatient: (id: string, patch: Partial<Patient>) => void;
  book: (i: BookInput) => Appointment;
  setApptStatus: (id: string, status: ApptStatus) => void;
  cancelAppt: (id: string, by: "paciente" | "consultorio") => void;
  reschedule: (id: string, date: string, time: string) => void;
  payAppt: (apptId: string, kind: "anticipo" | "total", ok: boolean) => void;
  refund: (apptId: string) => void;
  upsertService: (s: Service) => void;
  addBlock: (b: Omit<Block, "id">) => void;
  removeBlock: (id: string) => void;
  upsertContent: (c: ContentItem) => void;
  removeContent: (id: string) => void;
  addMedia: (m: Omit<MediaFile, "id" | "at">) => void;
  removeMedia: (id: string) => void;
  submitQuestion: (q: Pick<Question, "topic" | "title" | "body" | "author">) => void;
  updateQuestion: (id: string, patch: Partial<Question>) => void;
  likeQuestion: (id: string) => void;
  toggleExercise: (id: string) => void;
  setNotifRule: (event: NotifEvent, audience: "patient" | "erik", channel: "email" | "whatsapp", value: boolean) => void;
  setNotifContact: (patch: Partial<Pick<NotifSettings, "erikEmail" | "erikWhatsapp">>) => void;
  sendReminders: (kind: "recordatorio24" | "recordatorioHoy") => number;
  sendTest: (event: NotifEvent, audience: Audience) => void;
  audit: (action: string, target: string) => void;
  resetDemo: () => void;
}

const StoreCtx = createContext<Ctx | null>(null);

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("StoreProvider ausente");
  return c;
}

function apptVars(svcName: string, date: string, time: string, p: Patient): Vars {
  return {
    nombre: p.name.split(" ")[0],
    paciente: p.name.replace(/\s*\((demo|ficticio|ficticia)\)/i, ""),
    servicio: svcName,
    fecha: longDate(date).toLowerCase(),
    hora: fmtTime(time),
  };
}

/** Punto unico de "envio". En la demo solo registra el mensaje como Simulado.
 *  En produccion, aqui se llamaria al correo transaccional y a la API de WhatsApp Business. */
function fire(d: DB, event: NotifEvent, v: Vars, patient?: Patient): DB {
  const drafts = plan(d.notif ?? DEFAULT_SETTINGS, event, v, patient && { id: patient.id, email: patient.email, phone: patient.phone });
  const at = new Date().toISOString();
  return { ...d, notices: [...drafts.map((n) => ({ ...n, id: uid("n"), at })).reverse(), ...d.notices].slice(0, 200) };
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<DB>(() => makeSeed("2000-01-01"));
  const [ready, setReady] = useState(false);
  const skipSave = useRef(true);

  useEffect(() => {
    let loaded: DB | null = null;
    let session: DB["session"] = { ...GUEST };
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) loaded = JSON.parse(raw) as DB;
      const sraw = sessionStorage.getItem(SKEY);
      if (sraw) session = JSON.parse(sraw);
    } catch {}
    setDb({ ...(loaded ?? makeSeed(todayStr())), session });
    setReady(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY && e.newValue) {
        skipSave.current = true;
        try { const next = JSON.parse(e.newValue) as DB; setDb((cur) => ({ ...next, session: cur.session })); } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (skipSave.current) { skipSave.current = false; return; }
    try { localStorage.setItem(KEY, JSON.stringify({ ...db, session: GUEST })); } catch {}
  }, [db, ready]);

  useEffect(() => {
    if (!ready) return;
    try { sessionStorage.setItem(SKEY, JSON.stringify(db.session)); } catch {}
  }, [db.session, ready]);

  const mut = useCallback((fn: (d: DB) => DB) => setDb((d) => fn(d)), []);

  const api = useMemo<Ctx>(() => ({
    db, ready,
    loginAs: (role, patientId) => mut((d) => ({ ...d, session: { role, patientId } })),
    logout: () => mut((d) => ({ ...d, session: { role: "guest" } })),
    createPatient: (p) => {
      const np: Patient = { ...p, id: uid("p"), demo: true, createdAt: new Date().toISOString() };
      mut((d) => ({ ...d, patients: [np, ...d.patients] }));
      return np;
    },
    updatePatient: (id, patch) => mut((d) => ({ ...d, patients: d.patients.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
    book: (i) => {
      const a: Appointment = {
        id: uid("a"), patientId: i.patientId, serviceId: i.serviceId, date: i.date, time: i.time,
        status: "pendiente", pay: i.pay ?? "sin_pago", reason: i.reason, source: i.source ?? "web",
        createdAt: new Date().toISOString(),
      };
      mut((d) => {
        const p = d.patients.find((x) => x.id === i.patientId);
        const s = d.services.find((x) => x.id === i.serviceId);
        let n = { ...d, appointments: [...d.appointments, a] };
        if (p && s) {
          const v = apptVars(s.name, i.date, i.time, p);
          const origen = i.source === "manual" ? "alta manual" : i.source === "foro" ? "foro Pregúntale a Erik" : "sitio web";
          n = fire(n, "solicitud", v, p);
          n = fire(n, "nuevaCita", { ...v, origen }, p);
        }
        return n;
      });
      return a;
    },
    setApptStatus: (id, status) => mut((d) => {
      let n = { ...d, appointments: d.appointments.map((a) => (a.id === id ? { ...a, status } : a)) };
      const a = d.appointments.find((x) => x.id === id);
      const p = a && d.patients.find((x) => x.id === a.patientId);
      if (a && p && status === "confirmada" && a.status !== "confirmada") {
        const sv = d.services.find((x) => x.id === a.serviceId);
        n = fire(n, "confirmacion", apptVars(sv?.name ?? "tu cita", a.date, a.time, p), p);
      }
      return n;
    }),
    cancelAppt: (id, by) => mut((d) => {
      const a = d.appointments.find((x) => x.id === id);
      const p = a && d.patients.find((x) => x.id === a.patientId);
      let n = { ...d, appointments: d.appointments.map((x) => (x.id === id ? { ...x, status: "cancelada" as const } : x)) };
      if (a && p) {
        const sv = d.services.find((x) => x.id === a.serviceId);
        n = fire(n, "cancelacion", { ...apptVars(sv?.name ?? "tu cita", a.date, a.time, p), quien: by === "paciente" ? "el paciente" : "el consultorio" }, p);
      }
      return n;
    }),
    reschedule: (id, date, time) => mut((d) => {
      const a = d.appointments.find((x) => x.id === id);
      const p = a && d.patients.find((x) => x.id === a.patientId);
      let n = { ...d, appointments: d.appointments.map((x) => (x.id === id ? { ...x, date, time, status: "pendiente" as const } : x)) };
      if (a && p) {
        const sv = d.services.find((x) => x.id === a.serviceId);
        n = fire(n, "reprogramacion", apptVars(sv?.name ?? "tu cita", date, time, p), p);
      }
      return n;
    }),
    payAppt: (apptId, kind, ok) => mut((d) => {
      const a = d.appointments.find((x) => x.id === apptId);
      if (!a) return d;
      const s = d.services.find((x) => x.id === a.serviceId)!;
      const amount = kind === "anticipo" ? s.deposit : s.price;
      const pay = { id: uid("pay"), apptId, patientId: a.patientId, amount, concept: (kind === "anticipo" ? "Anticipo" : "Consulta") as "Anticipo" | "Consulta", status: (ok ? "aprobado" : "rechazado") as "aprobado" | "rechazado", method: "Pasarela de demostración" as const, date: todayStr() };
      let n: DB = {
        ...d, payments: [pay, ...d.payments],
        appointments: d.appointments.map((x) => (x.id === apptId ? { ...x, pay: ok ? (kind === "anticipo" ? "anticipo" : "pagado") : "fallido" } : x)),
      };
      const p = d.patients.find((x) => x.id === a.patientId);
      if (ok && p) n = fire(n, "pago", { ...apptVars(s.name, a.date, a.time, p), monto: `$${amount}`, concepto: pay.concept.toLowerCase() }, p);
      return n;
    }),
    refund: (apptId) => mut((d) => {
      const a = d.appointments.find((x) => x.id === apptId);
      if (!a) return d;
      return {
        ...d,
        appointments: d.appointments.map((x) => (x.id === apptId ? { ...x, pay: "reembolsado" as const } : x)),
        payments: d.payments.map((p) => (p.apptId === apptId && p.status === "aprobado" ? { ...p, status: "reembolsado" as const } : p)),
      };
    }),
    upsertService: (s) => mut((d) => ({ ...d, services: d.services.some((x) => x.id === s.id) ? d.services.map((x) => (x.id === s.id ? s : x)) : [...d.services, s] })),
    addBlock: (b) => mut((d) => ({ ...d, blocks: [...d.blocks, { ...b, id: uid("b") }] })),
    removeBlock: (id) => mut((d) => ({ ...d, blocks: d.blocks.filter((b) => b.id !== id) })),
    upsertContent: (c) => mut((d) => ({ ...d, content: d.content.some((x) => x.id === c.id) ? d.content.map((x) => (x.id === c.id ? c : x)) : [c, ...d.content] })),
    removeContent: (id) => mut((d) => ({ ...d, content: d.content.filter((c) => c.id !== id) })),
    addMedia: (m) => mut((d) => ({ ...d, media: [{ ...m, id: uid("m"), at: new Date().toISOString() }, ...d.media] })),
    removeMedia: (id) => mut((d) => ({ ...d, media: d.media.filter((m) => m.id !== id) })),
    submitQuestion: (q) => mut((d) => {
      const nq: Question = { ...q, id: uid("q"), status: "pendiente", me2: 0, createdAt: new Date().toISOString() };
      return fire({ ...d, questions: [nq, ...d.questions] }, "nuevaPregunta", { pregunta: q.title });
    }),
    updateQuestion: (id, patch) => mut((d) => ({ ...d, questions: d.questions.map((q) => (q.id === id ? { ...q, ...patch } : q)) })),
    likeQuestion: (id) => mut((d) => ({ ...d, questions: d.questions.map((q) => (q.id === id ? { ...q, me2: q.me2 + 1 } : q)) })),
    toggleExercise: (id) => mut((d) => { const cur = d.exDone ?? []; return { ...d, exDone: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] }; }),
    setNotifRule: (event, audience, channel, value) => mut((d) => {
      const cur = d.notif ?? DEFAULT_SETTINGS;
      const rule = cur.rules[event];
      const pref = { ...(rule[audience] ?? { email: false, whatsapp: false }), [channel]: value };
      return { ...d, notif: { ...cur, rules: { ...cur.rules, [event]: { ...rule, [audience]: pref } } } };
    }),
    setNotifContact: (patch) => mut((d) => ({ ...d, notif: { ...(d.notif ?? DEFAULT_SETTINGS), ...patch } })),
    sendReminders: (kind) => {
      const target = kind === "recordatorio24" ? addDays(todayStr(), 1) : todayStr();
      const list = db.appointments.filter((a) => a.date === target && (a.status === "confirmada" || a.status === "pendiente"));
      if (list.length) mut((d) => list.reduce((acc, a) => {
        const p = acc.patients.find((x) => x.id === a.patientId);
        const sv = acc.services.find((x) => x.id === a.serviceId);
        return p && sv ? fire(acc, kind, apptVars(sv.name, a.date, a.time, p), p) : acc;
      }, d));
      return list.length;
    },
    sendTest: (event, audience) => mut((d) => {
      const cfg = d.notif ?? DEFAULT_SETTINGS;
      const label = EVENTS.find((e) => e.id === event)!.label;
      const at = new Date().toISOString();
      const mk = (channel: "Correo" | "WhatsApp", to: string): Omit<Notice, "id" | "at"> | null => {
        const r = render(event, audience, channel, SAMPLE);
        return r ? { channel, template: `Prueba · ${label}`, to, subject: r.subject, body: r.body, audience: "Erik", event, status: "Simulado", test: true } : null;
      };
      const items = [mk("Correo", cfg.erikEmail), mk("WhatsApp", cfg.erikWhatsapp)].filter((x): x is Omit<Notice, "id" | "at"> => !!x);
      return { ...d, notices: [...items.map((n) => ({ ...n, id: uid("n"), at })), ...d.notices].slice(0, 200) };
    }),
    audit: (action, target) => mut((d) => ({ ...d, audit: [{ id: uid("au"), at: new Date().toISOString(), actor: "Erik (admin demo)", action, target }, ...d.audit].slice(0, 100) })),
    resetDemo: () => { skipSave.current = false; setDb((cur) => ({ ...makeSeed(todayStr()), session: cur.session })); },
  }), [db, ready, mut]);

  return <StoreCtx.Provider value={api}>{children}</StoreCtx.Provider>;
}
