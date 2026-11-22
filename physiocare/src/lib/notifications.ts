import type { Audience, Channel, Notice, NotifEvent, NotifSettings } from "./types";
import { BRAND } from "./seed";

export const EVENTS: { id: NotifEvent; label: string; when: string; patient: boolean; erik: boolean }[] = [
  { id: "solicitud", label: "Solicitud de cita recibida", when: "Al agendar", patient: true, erik: false },
  { id: "confirmacion", label: "Confirmación de cita", when: "Cuando Erik o el pago confirman la cita", patient: true, erik: false },
  { id: "recordatorio24", label: "Recordatorio 24 horas antes", when: "El día anterior", patient: true, erik: false },
  { id: "recordatorioHoy", label: "Recordatorio el mismo día", when: "La mañana de la cita", patient: true, erik: false },
  { id: "rachaRiesgo", label: "Racha en riesgo", when: "Cuando aún no registra sus ejercicios del día", patient: true, erik: false },
  { id: "cancelacion", label: "Cancelación", when: "Al cancelar una cita", patient: true, erik: true },
  { id: "reprogramacion", label: "Reprogramación", when: "Al mover una cita", patient: true, erik: true },
  { id: "pago", label: "Pago", when: "Al aprobarse un pago", patient: true, erik: true },
  { id: "nuevaCita", label: "Nueva cita", when: "Cuando un paciente agenda", patient: false, erik: true },
  { id: "nuevaPregunta", label: "Nueva pregunta del foro", when: "Cuando llega una pregunta por moderar", patient: false, erik: true },
];

const on = { email: true, whatsapp: true };
export const DEFAULT_SETTINGS: NotifSettings = {
  erikEmail: "erik@ejemplo.demo", // DEMO: correo ficticio
  erikWhatsapp: "844 000 0000", // DEMO: número ficticio
  rules: {
    solicitud: { patient: { ...on } },
    confirmacion: { patient: { ...on } },
    recordatorio24: { patient: { email: false, whatsapp: true } },
    recordatorioHoy: { patient: { email: false, whatsapp: true } },
    rachaRiesgo: { patient: { email: false, whatsapp: true } },
    cancelacion: { patient: { ...on }, erik: { ...on } },
    reprogramacion: { patient: { ...on }, erik: { email: false, whatsapp: true } },
    pago: { patient: { email: true, whatsapp: false }, erik: { ...on } },
    nuevaCita: { erik: { ...on } },
    nuevaPregunta: { erik: { email: true, whatsapp: false } },
  },
};

export interface Vars {
  nombre?: string; paciente?: string; servicio?: string; fecha?: string; hora?: string;
  monto?: string; concepto?: string; pregunta?: string; origen?: string; quien?: string; racha?: string;
}
interface Tpl { subject: string; email: string; whatsapp: string }
const SIGN = `\n\n${BRAND.name}`;

export const TEMPLATES: Record<NotifEvent, { patient?: Tpl; erik?: Tpl }> = {
  solicitud: { patient: {
    subject: "Recibimos tu solicitud de cita",
    email: "Hola {nombre},\n\nRecibimos tu solicitud de {servicio} para el {fecha} a las {hora}. Erik la revisará y te confirmaremos a la brevedad." + SIGN,
    whatsapp: "Hola {nombre}, recibimos tu solicitud de {servicio} para el {fecha} a las {hora}. Te confirmamos en breve.",
  } },
  confirmacion: { patient: {
    subject: "Tu cita está confirmada",
    email: "Hola {nombre},\n\nTu cita de {servicio} quedó confirmada para el {fecha} a las {hora}.\n\nAntes de venir: llega 10 minutos antes y trae ropa cómoda. Si necesitas cambiarla, puedes reprogramar o cancelar desde tu cuenta." + SIGN,
    whatsapp: "Hola {nombre}, tu cita de {servicio} está confirmada: {fecha} a las {hora}. Llega 10 minutos antes y trae ropa cómoda.",
  } },
  recordatorio24: { patient: {
    subject: "Recordatorio: tu cita es mañana",
    email: "Hola {nombre},\n\nTe recordamos tu cita de {servicio} mañana, {fecha}, a las {hora}. Si necesitas cambiarla, avísanos con tiempo." + SIGN,
    whatsapp: "Hola {nombre}, te recordamos tu cita de mañana: {servicio}, {fecha} a las {hora}. Si necesitas cambiarla, avísanos con tiempo.",
  } },
  recordatorioHoy: { patient: {
    subject: "Hoy es tu cita",
    email: "Hola {nombre},\n\nHoy tienes cita de {servicio} a las {hora}. ¡Te esperamos!" + SIGN,
    whatsapp: "Hola {nombre}, hoy tienes cita a las {hora} ({servicio}). ¡Te esperamos!",
  } },
  rachaRiesgo: { patient: {
    subject: "Tu racha está en riesgo",
    email: "Hola {nombre},\n\nLlevas {racha} días seguidos con tus ejercicios y hoy aún no registras ninguno. Con uno solo mantienes tu racha.\n\nSi hoy no puedes, no pasa nada: retómalo mañana." + SIGN,
    whatsapp: "Hola {nombre}, llevas {racha} días seguidos con tus ejercicios. Hoy aún no registras ninguno: con uno solo mantienes tu racha.",
  } },
  cancelacion: {
    patient: {
      subject: "Tu cita fue cancelada",
      email: "Hola {nombre},\n\nTu cita de {servicio} del {fecha} a las {hora} fue cancelada por {quien}. Los reembolsos están sujetos a la política del consultorio. Puedes agendar de nuevo cuando quieras." + SIGN,
      whatsapp: "Hola {nombre}, tu cita del {fecha} a las {hora} fue cancelada por {quien}. Puedes agendar de nuevo desde el sitio.",
    },
    erik: {
      subject: "Cita cancelada: {paciente}",
      email: "{paciente} canceló ({quien}) su cita de {servicio} del {fecha} a las {hora}. El horario quedó libre en tu agenda.",
      whatsapp: "Cancelación ({quien}): {paciente}, {servicio}, {fecha} {hora}. El horario quedó libre.",
    },
  },
  reprogramacion: {
    patient: {
      subject: "Tu cita fue reprogramada",
      email: "Hola {nombre},\n\nTu cita de {servicio} se movió al {fecha} a las {hora}." + SIGN,
      whatsapp: "Hola {nombre}, tu cita de {servicio} se movió al {fecha} a las {hora}.",
    },
    erik: {
      subject: "Cita reprogramada: {paciente}",
      email: "La cita de {paciente} ({servicio}) ahora es el {fecha} a las {hora}.",
      whatsapp: "Reprogramación: {paciente}, {servicio}, nueva fecha {fecha} {hora}.",
    },
  },
  pago: {
    patient: {
      subject: "Recibimos tu pago",
      email: "Hola {nombre},\n\nRecibimos tu {concepto} por {monto} (pago simulado de demostración). Gracias." + SIGN,
      whatsapp: "Hola {nombre}, recibimos tu {concepto} por {monto}. Gracias.",
    },
    erik: {
      subject: "Pago recibido: {paciente}",
      email: "{paciente} realizó un {concepto} por {monto} (simulado).",
      whatsapp: "Pago recibido (simulado): {paciente}, {concepto} {monto}.",
    },
  },
  nuevaCita: { erik: {
    subject: "Nueva cita: {paciente}",
    email: "{paciente} agendó {servicio} para el {fecha} a las {hora}.\nOrigen: {origen}.",
    whatsapp: "Nueva cita: {paciente}, {servicio}, {fecha} {hora}. Origen: {origen}.",
  } },
  nuevaPregunta: { erik: {
    subject: "Nueva pregunta por moderar",
    email: "Llegó una pregunta al foro y espera tu aprobación:\n\n«{pregunta}»",
    whatsapp: "Nueva pregunta por moderar: «{pregunta}».",
  } },
};

const fill = (t: string, v: Vars) => t.replace(/\{(\w+)\}/g, (_, k: string) => (v as Record<string, string | undefined>)[k] ?? "").replace(/m\.\./g, "m.");

export function render(event: NotifEvent, audience: Audience, channel: Channel, v: Vars): { subject?: string; body: string } | null {
  const t = TEMPLATES[event][audience === "Paciente" ? "patient" : "erik"];
  if (!t) return null;
  return channel === "Correo" ? { subject: fill(t.subject, v), body: fill(t.email, v) } : { body: fill(t.whatsapp, v) };
}

export const SAMPLE: Vars = {
  nombre: "Ana", paciente: "Ana Ramírez", servicio: "Fisioterapia deportiva", fecha: "martes 24 de noviembre", hora: "5:00 p. m.",
  monto: "$200", racha: "8", concepto: "anticipo", pregunta: "¿Puedo correr si tengo dolor de rodilla?", origen: "sitio web", quien: "el paciente",
};

/** Mensajes a generar para un evento, según las reglas y los contactos. */
export function plan(
  s: NotifSettings, event: NotifEvent, v: Vars,
  patient?: { id: string; email: string; phone: string },
): Omit<Notice, "id" | "at">[] {
  const out: Omit<Notice, "id" | "at">[] = [];
  const rule = ruleFor(s, event);
  const label = EVENTS.find((e) => e.id === event)!.label;
  const add = (aud: Audience, ch: Channel, to: string, pid?: string) => {
    const r = render(event, aud, ch, v);
    if (r) out.push({ channel: ch, template: label, to, subject: r.subject, body: r.body, audience: aud, event, patientId: pid, status: "Simulado" });
  };
  if (rule.patient && patient) {
    if (rule.patient.email) add("Paciente", "Correo", patient.email, patient.id);
    if (rule.patient.whatsapp) add("Paciente", "WhatsApp", patient.phone, patient.id);
  }
  if (rule.erik) {
    if (rule.erik.email) add("Erik", "Correo", s.erikEmail);
    if (rule.erik.whatsapp) add("Erik", "WhatsApp", s.erikWhatsapp);
  }
  return out;
}

/** Número para wa.me (México: 10 dígitos → 52 + número). */
export function waNumber(phone: string): string {
  const d = phone.replace(/\D/g, "");
  return d.length === 10 ? `52${d}` : d;
}

/** Regla de un evento; si los ajustes guardados son anteriores a ese evento, usa la regla por defecto. */
export function ruleFor(s: NotifSettings, event: NotifEvent) {
  return s.rules[event] ?? DEFAULT_SETTINGS.rules[event];
}
