"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Appointment, ApptStatus, Block, ContentItem, DB, MediaFile, Notice, Patient, PayStatus, Question, Service } from "./types";
import { BRAND, makeSeed } from "./seed";
import { fmtTime, longDate, todayStr, uid } from "./dates";

const KEY = "efr-demo-v1";

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
  audit: (action: string, target: string) => void;
  resetDemo: () => void;
}

const StoreCtx = createContext<Ctx | null>(null);

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("StoreProvider ausente");
  return c;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<DB>(() => makeSeed("2000-01-01"));
  const [ready, setReady] = useState(false);
  const skipSave = useRef(true);

  useEffect(() => {
    let loaded: DB | null = null;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) loaded = JSON.parse(raw) as DB;
    } catch {}
    setDb(loaded ?? makeSeed(todayStr()));
    setReady(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY && e.newValue) {
        skipSave.current = true;
        try { setDb(JSON.parse(e.newValue) as DB); } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (skipSave.current) { skipSave.current = false; return; }
    try { localStorage.setItem(KEY, JSON.stringify(db)); } catch {}
  }, [db, ready]);

  const mut = useCallback((fn: (d: DB) => DB) => setDb((d) => fn(d)), []);

  const notice = (d: DB, n: Omit<Notice, "id" | "at">): DB => ({
    ...d, notices: [{ ...n, id: uid("n"), at: new Date().toISOString() }, ...d.notices],
  });

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
        const when = `${longDate(i.date)}, ${fmtTime(i.time)}`;
        let n = { ...d, appointments: [...d.appointments, a] };
        if (p && s) {
          n = notice(n, { channel: "Correo", template: "Confirmación de cita", to: p.email, body: `Hola ${p.name.split(" ")[0]}, recibimos tu solicitud de ${s.name} para el ${when}. Erik la confirmará a la brevedad.` });
          n = notice(n, { channel: "WhatsApp", template: "Confirmación de cita", to: p.phone, body: `${BRAND.name}: tu cita de ${s.name} quedó registrada para el ${when}. Responde 1 para confirmar o 2 para reprogramar.` });
          n = notice(n, { channel: "Aviso interno", template: "Nueva cita", to: "Erik", body: `Nueva cita ${i.source === "manual" ? "(alta manual) " : ""}de ${p.name}: ${s.name}, ${when}.` });
        }
        return n;
      });
      return a;
    },
    setApptStatus: (id, status) => mut((d) => {
      let n = { ...d, appointments: d.appointments.map((a) => (a.id === id ? { ...a, status } : a)) };
      const a = d.appointments.find((x) => x.id === id);
      const p = a && d.patients.find((x) => x.id === a.patientId);
      if (a && p && status === "confirmada") {
        n = notice(n, { channel: "WhatsApp", template: "Cita confirmada", to: p.phone, body: `Tu cita del ${longDate(a.date)} a las ${fmtTime(a.time)} fue confirmada. ¡Te esperamos!` });
      }
      return n;
    }),
    cancelAppt: (id, by) => mut((d) => {
      const a = d.appointments.find((x) => x.id === id);
      const p = a && d.patients.find((x) => x.id === a.patientId);
      let n = { ...d, appointments: d.appointments.map((x) => (x.id === id ? { ...x, status: "cancelada" as const } : x)) };
      if (a && p) {
        n = notice(n, { channel: "Correo", template: "Cancelación", to: p.email, body: `Tu cita del ${longDate(a.date)} a las ${fmtTime(a.time)} fue cancelada por ${by}. Los reembolsos están sujetos a la política del consultorio.` });
        n = notice(n, { channel: "Aviso interno", template: "Cancelación", to: "Erik", body: `${p.name} canceló (${by}): ${longDate(a.date)}, ${fmtTime(a.time)}.` });
      }
      return n;
    }),
    reschedule: (id, date, time) => mut((d) => {
      const a = d.appointments.find((x) => x.id === id);
      const p = a && d.patients.find((x) => x.id === a.patientId);
      let n = { ...d, appointments: d.appointments.map((x) => (x.id === id ? { ...x, date, time, status: "pendiente" as const } : x)) };
      if (a && p) n = notice(n, { channel: "WhatsApp", template: "Reprogramación", to: p.phone, body: `Tu cita se movió al ${longDate(date)} a las ${fmtTime(time)}.` });
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
      if (ok && p) n = notice(n, { channel: "Correo", template: "Confirmación de pago", to: p.email, body: `Recibimos tu ${pay.concept.toLowerCase()} de ${amount} MXN (pago simulado de demostración).` });
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
      return notice({ ...d, questions: [nq, ...d.questions] }, { channel: "Aviso interno", template: "Nueva pregunta", to: "Erik", body: `Pregunta pendiente de moderación: «${q.title}»` });
    }),
    updateQuestion: (id, patch) => mut((d) => ({ ...d, questions: d.questions.map((q) => (q.id === id ? { ...q, ...patch } : q)) })),
    likeQuestion: (id) => mut((d) => ({ ...d, questions: d.questions.map((q) => (q.id === id ? { ...q, me2: q.me2 + 1 } : q)) })),
    audit: (action, target) => mut((d) => ({ ...d, audit: [{ id: uid("au"), at: new Date().toISOString(), actor: "Erik (admin demo)", action, target }, ...d.audit].slice(0, 100) })),
    resetDemo: () => { skipSave.current = false; setDb(makeSeed(todayStr())); },
  }), [db, ready, mut]);

  return <StoreCtx.Provider value={api}>{children}</StoreCtx.Provider>;
}
