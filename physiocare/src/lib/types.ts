export type Role = "guest" | "patient" | "admin";

export interface Service {
  id: string;
  name: string;
  short: string;
  description: string;
  benefits: string[];
  duration: number; // minutos
  price: number; // MXN
  deposit: number; // anticipo MXN
  days: number[]; // 0=dom ... 6=sab
  active: boolean;
  image: string;
}

export type ApptStatus = "pendiente" | "confirmada" | "completada" | "cancelada" | "no_asistio";
export type PayStatus = "sin_pago" | "anticipo" | "pagado" | "reembolsado" | "fallido";

export interface Appointment {
  id: string;
  patientId: string;
  serviceId: string;
  date: string; // YYYY-MM-DD (America/Monterrey)
  time: string; // HH:mm
  status: ApptStatus;
  pay: PayStatus;
  reason?: string;
  source: "web" | "manual" | "foro";
  createdAt: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  birth?: string;
  notes?: string; // seguimiento administrativo
  demo: boolean;
  createdAt: string;
}

export type QStatus = "pendiente" | "publicada" | "rechazada";
export interface Question {
  id: string;
  topic: string;
  title: string;
  body: string;
  author: string; // nombre visible o "Anónimo"
  status: QStatus;
  answer?: string;
  suggestedServiceId?: string;
  me2: number;
  createdAt: string;
}

export type ContentType = "video" | "instagram" | "consejo" | "novedad";
export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  category: string;
  youtubeId?: string;
  url?: string;
  image: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
}

export interface Payment {
  id: string;
  apptId: string;
  patientId: string;
  amount: number;
  concept: "Anticipo" | "Consulta" | "Reembolso";
  status: "pendiente" | "aprobado" | "rechazado" | "reembolsado";
  method: "Pasarela de demostración" | "En consultorio";
  date: string;
}

export interface Block {
  id: string;
  date: string;
  start: string;
  end: string;
  reason: string;
}

export type NotifEvent =
  | "solicitud" | "confirmacion" | "recordatorio24" | "recordatorioHoy"
  | "cancelacion" | "reprogramacion" | "pago" | "nuevaCita" | "nuevaPregunta";
export type Audience = "Paciente" | "Erik";
export type Channel = "Correo" | "WhatsApp";
export interface ChannelPref { email: boolean; whatsapp: boolean }
export interface NotifRule { patient?: ChannelPref; erik?: ChannelPref }
export interface NotifSettings {
  erikEmail: string;
  erikWhatsapp: string;
  rules: Record<NotifEvent, NotifRule>;
}

export interface Notice {
  id: string;
  channel: Channel | "Aviso interno";
  template: string;
  to: string;
  subject?: string;
  body: string;
  at: string;
  audience?: Audience;
  event?: NotifEvent;
  patientId?: string;
  status?: "Simulado";
  test?: boolean;
}

export interface AuditEntry {
  id: string;
  at: string;
  actor: string;
  action: string;
  target: string;
}

export interface MediaFile {
  id: string;
  name: string;
  kind: "imagen" | "video" | "documento";
  size: number;
  dataUrl?: string; // solo imágenes pequeñas, en el navegador
  at: string;
}

export interface Session {
  role: Role;
  patientId?: string;
}

export interface DB {
  services: Service[];
  patients: Patient[];
  appointments: Appointment[];
  questions: Question[];
  content: ContentItem[];
  payments: Payment[];
  blocks: Block[];
  notices: Notice[];
  audit: AuditEntry[];
  media: MediaFile[];
  session: Session;
  exDone?: string[]; // en desuso: se conserva por compatibilidad con datos guardados
  exLog?: Record<string, Record<string, string[]>>; // paciente → fecha → ejercicios completados
  exStart?: Record<string, string>; // paciente → fecha de inicio del plan
  notif?: NotifSettings;
}
