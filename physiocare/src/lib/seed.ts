import type { DB, Service } from "./types";
import { addDays, dow } from "./dates";
import { IMG } from "./images";

export const BRAND = {
  name: "Erik Fitness and Rehab",
  owner: "Erik Esqueda",
  tagline: "Fisioterapia y rendimiento en Saltillo",
  instagram: "https://www.instagram.com/erikfitnessandrehab/",
  igHandle: "@erikfitnessandrehab",
  whatsapp: "528440000000", // DEMO: reemplazar por el número real
  phone: "844 000 0000", // DEMO
  email: "contacto@ejemplo.com", // DEMO
  address: "Saltillo, Coahuila",
};

/** Perfil público de Erik. Cualquier campo vacío NO se muestra en el sitio.
 *  No se inventan cifras ni credenciales: Erik las captura cuando quiera mostrarlas. */
export const PROFILE = {
  name: "Erik Esqueda",
  role: "Fisioterapeuta · Entrenamiento · Rendimiento",
  pitch: "Ayudo a personas activas y deportistas a recuperar movimiento, fuerza y confianza para volver a hacer lo que les gusta.",
  location: "Saltillo, Coahuila",
  followers: "16 mil+", // visto en su perfil público de Instagram
  years: "", // ej. "8"
  patients: "", // ej. "1,500"
  specialty: "Lesiones deportivas y dolor",
  education: [] as string[],
  certifications: [] as string[],
  experience: [] as string[],
  philosophy: "",
  // Reseñas de EJEMPLO para la demo. Al tener reseñas reales y autorizadas: sustituir la lista,
  // poner reviewsAreDemo en false y capturar la calificación real.
  reviewsAreDemo: true,
  reviewsRating: "4.9",
  reviews: [
    { name: "Paciente de ejemplo", detail: "Corredor recreativo", text: "Llegué con dolor en la rodilla y salí con un plan claro. Me explicó todo sin tecnicismos y me fue guiando paso a paso.", stars: 5 },
    { name: "Paciente de ejemplo", detail: "Entrenamiento de fuerza", text: "Muy buena atención. Se nota que sabe de rendimiento: me ayudó a volver al gimnasio con confianza y sin prisas.", stars: 5 },
    { name: "Paciente de ejemplo", detail: "Trabajo de oficina", text: "Agendar fue facilísimo desde el celular y los recordatorios por WhatsApp me ayudaron mucho. Excelente trato.", stars: 5 },
  ] as { name: string; detail: string; text: string; stars: number }[],
};

export const SERVICES: Service[] = [
  {
    id: "s_eval", name: "Evaluación funcional", short: "Valoración inicial completa",
    description: "Revisión de tu historia, movilidad, fuerza y patrón de movimiento para entender el origen de tu molestia y definir un plan.",
    benefits: ["Valoración profesional personalizada", "Plan de trabajo por etapas", "Resolución de dudas sobre tu lesión"],
    duration: 60, price: 600, deposit: 200, days: [1, 2, 3, 4, 5, 6], active: true, image: IMG.stretch,
  },
  {
    id: "s_dep", name: "Fisioterapia deportiva", short: "Lesiones deportivas y retorno al juego",
    description: "Tratamiento enfocado en deportistas y personas activas: manejo de la lesión y progresión de carga para volver a entrenar.",
    benefits: ["Enfoque en tu deporte", "Progresión de carga guiada", "Prevención de recaídas"],
    duration: 60, price: 700, deposit: 250, days: [1, 2, 3, 4, 5, 6], active: true, image: IMG.barbell,
  },
  {
    id: "s_rehab", name: "Rehabilitación física", short: "Recupera movilidad y fuerza",
    description: "Programa de ejercicio terapéutico y técnicas de apoyo para recuperar función después de una lesión o periodo de inactividad.",
    benefits: ["Ejercicio terapéutico progresivo", "Seguimiento de tu evolución", "Educación para tu autonomía"],
    duration: 60, price: 650, deposit: 200, days: [1, 2, 3, 4, 5, 6], active: true, image: IMG.pullup,
  },
  {
    id: "s_manual", name: "Terapia manual", short: "Técnicas manuales para dolor y rigidez",
    description: "Técnicas manuales dirigidas a disminuir molestias y mejorar la movilidad, combinadas con ejercicio cuando es adecuado.",
    benefits: ["Alivio de tensión y rigidez", "Mejor rango de movimiento", "Complemento del ejercicio"],
    duration: 45, price: 550, deposit: 200, days: [1, 2, 3, 4, 5], active: true, image: IMG.manual,
  },
  {
    id: "s_dolor", name: "Tratamiento de dolor muscular", short: "Dolor de espalda, cuello y articulaciones",
    description: "Abordaje del dolor muscular y articular con educación, movimiento y técnicas de apoyo, según tu valoración.",
    benefits: ["Entiendes qué te duele y por qué", "Estrategias para tu día a día", "Plan de ejercicios en casa"],
    duration: 45, price: 550, deposit: 200, days: [1, 2, 3, 4, 5, 6], active: true, image: IMG.manualBw,
  },
  {
    id: "s_lesion", name: "Recuperación de lesiones", short: "Esguinces, tendones, músculo y más",
    description: "Seguimiento de lesiones musculoesqueléticas con metas claras por fase, desde el control del dolor hasta el regreso a tu actividad.",
    benefits: ["Metas claras por fase", "Ajustes según tu respuesta", "Criterios para volver a tu actividad"],
    duration: 60, price: 650, deposit: 200, days: [1, 2, 3, 4, 5, 6], active: true, image: IMG.runners,
  },
  {
    id: "s_post", name: "Rehabilitación postoperatoria", short: "Seguimiento después de cirugía",
    description: "Acompañamiento de tu recuperación posterior a una cirugía, en coordinación con las indicaciones de tu médico tratante.",
    benefits: ["Coordinado con tu médico", "Progresión segura", "Recuperación funcional"],
    duration: 60, price: 750, deposit: 250, days: [1, 2, 3, 4, 5], active: true, image: IMG.care,
  },
];

export const TOPICS = ["Espalda y cuello", "Rodilla", "Hombro", "Lesiones deportivas", "Ciática", "Mitos y diagnósticos", "Ejercicio y fuerza", "Otro"];

export function makeSeed(today: string): DB {
  // Las citas semilla caen en días laborales (domingo cerrado, sábado hasta las 13:00).
  const d = (n: number) => {
    const x = addDays(today, n);
    return dow(x) === 0 ? addDays(x, n >= 0 ? 1 : -2) : x;
  };
  const t = (n: number, time: string) => (dow(addDays(today, n)) === 6 && time >= "13:00" ? "11:00" : time);
  const iso = new Date().toISOString();
  const past = new Date(Date.now() - 3 * 86_400_000).toISOString(); // las citas de ejemplo no son "nuevas"
  return {
    services: SERVICES,
    patients: [
      { id: "p_ana", name: "Ana Ramírez (demo)", email: "paciente.demo@erikfitness.demo", phone: "844 555 0101", birth: "1992-04-18", notes: "Cuenta de demostración. Prefiere citas por la tarde.", demo: true, createdAt: iso },
      { id: "p_luis", name: "Luis Hernández (ficticio)", email: "luis@ejemplo.demo", phone: "844 555 0102", birth: "1988-09-02", notes: "Corredor de media maratón.", demo: true, createdAt: iso },
      { id: "p_carla", name: "Carla Montemayor (ficticia)", email: "carla@ejemplo.demo", phone: "844 555 0103", birth: "1995-01-27", notes: "Pendiente de enviar ejercicios en casa.", demo: true, createdAt: iso },
      { id: "p_diego", name: "Diego Salazar (ficticio)", email: "diego@ejemplo.demo", phone: "844 555 0104", birth: "2001-11-12", notes: "Futbolista universitario.", demo: true, createdAt: iso },
      { id: "p_sofia", name: "Sofía Treviño (ficticia)", email: "sofia@ejemplo.demo", phone: "844 555 0105", birth: "1979-06-30", notes: "", demo: true, createdAt: iso },
      { id: "p_marco", name: "Marco Villarreal (ficticio)", email: "marco@ejemplo.demo", phone: "844 555 0106", birth: "1984-03-08", notes: "Postoperatorio de rodilla.", demo: true, createdAt: iso },
    ],
    appointments: [
      { id: "a1", patientId: "p_luis", serviceId: "s_dep", date: d(0), time: t(0, "10:00"), status: "confirmada", pay: "pagado", source: "web", reason: "Dolor en rodilla al correr", createdAt: past },
      { id: "a2", patientId: "p_carla", serviceId: "s_manual", date: d(0), time: t(0, "12:00"), status: "pendiente", pay: "anticipo", source: "web", createdAt: past },
      { id: "a3", patientId: "p_diego", serviceId: "s_lesion", date: d(0), time: t(0, "16:00"), status: "confirmada", pay: "sin_pago", source: "manual", createdAt: past },
      { id: "a4", patientId: "p_ana", serviceId: "s_rehab", date: d(2), time: t(2, "17:00"), status: "confirmada", pay: "anticipo", source: "web", reason: "Seguimiento de hombro", createdAt: past },
      { id: "a5", patientId: "p_marco", serviceId: "s_post", date: d(1), time: t(1, "09:00"), status: "confirmada", pay: "pagado", source: "web", createdAt: past },
      { id: "a6", patientId: "p_sofia", serviceId: "s_dolor", date: d(3), time: t(3, "11:00"), status: "pendiente", pay: "sin_pago", source: "foro", reason: "Dolor lumbar", createdAt: past },
      { id: "a7", patientId: "p_luis", serviceId: "s_dep", date: d(5), time: t(5, "10:00"), status: "confirmada", pay: "anticipo", source: "web", createdAt: past },
      { id: "a8", patientId: "p_ana", serviceId: "s_eval", date: d(-9), time: t(-9, "17:00"), status: "completada", pay: "pagado", source: "web", createdAt: past },
      { id: "a9", patientId: "p_ana", serviceId: "s_rehab", date: d(-4), time: t(-4, "17:00"), status: "completada", pay: "pagado", source: "web", createdAt: past },
      { id: "a10", patientId: "p_carla", serviceId: "s_eval", date: d(-12), time: t(-12, "10:00"), status: "completada", pay: "pagado", source: "web", createdAt: past },
      { id: "a11", patientId: "p_diego", serviceId: "s_dep", date: d(-6), time: t(-6, "16:00"), status: "cancelada", pay: "reembolsado", source: "web", createdAt: past },
      { id: "a12", patientId: "p_marco", serviceId: "s_post", date: d(-3), time: t(-3, "09:00"), status: "completada", pay: "pagado", source: "web", createdAt: past },
      { id: "a13", patientId: "p_sofia", serviceId: "s_eval", date: d(-20), time: t(-20, "12:00"), status: "completada", pay: "pagado", source: "web", createdAt: past },
      { id: "a14", patientId: "p_luis", serviceId: "s_lesion", date: d(-15), time: t(-15, "10:00"), status: "completada", pay: "pagado", source: "manual", createdAt: past },
    ],
    payments: [
      { id: "pay1", apptId: "a1", patientId: "p_luis", amount: 700, concept: "Consulta", status: "aprobado", method: "Pasarela de demostración", date: d(-1) },
      { id: "pay2", apptId: "a2", patientId: "p_carla", amount: 200, concept: "Anticipo", status: "aprobado", method: "Pasarela de demostración", date: d(-1) },
      { id: "pay3", apptId: "a4", patientId: "p_ana", amount: 200, concept: "Anticipo", status: "aprobado", method: "Pasarela de demostración", date: d(-1) },
      { id: "pay4", apptId: "a5", patientId: "p_marco", amount: 750, concept: "Consulta", status: "aprobado", method: "Pasarela de demostración", date: d(-2) },
      { id: "pay5", apptId: "a8", patientId: "p_ana", amount: 600, concept: "Consulta", status: "aprobado", method: "En consultorio", date: d(-9) },
      { id: "pay6", apptId: "a9", patientId: "p_ana", amount: 650, concept: "Consulta", status: "aprobado", method: "Pasarela de demostración", date: d(-4) },
      { id: "pay7", apptId: "a11", patientId: "p_diego", amount: 250, concept: "Anticipo", status: "reembolsado", method: "Pasarela de demostración", date: d(-7) },
      { id: "pay8", apptId: "a12", patientId: "p_marco", amount: 750, concept: "Consulta", status: "aprobado", method: "Pasarela de demostración", date: d(-3) },
      { id: "pay9", apptId: "a10", patientId: "p_carla", amount: 600, concept: "Consulta", status: "aprobado", method: "En consultorio", date: d(-12) },
      { id: "pay10", apptId: "a13", patientId: "p_sofia", amount: 600, concept: "Consulta", status: "aprobado", method: "En consultorio", date: d(-20) },
      { id: "pay11", apptId: "a14", patientId: "p_luis", amount: 650, concept: "Consulta", status: "aprobado", method: "Pasarela de demostración", date: d(-15) },
    ],
    blocks: [{ id: "b1", date: d(1), start: "14:00", end: "15:00", reason: "Comida" }, { id: "b2", date: d(4), start: "09:00", end: "13:00", reason: "Curso de actualización (ejemplo)" }],
    questions: [
      { id: "q1", topic: "Mitos y diagnósticos", title: "¿Una pierna más larga que la otra es motivo de preocupación?", body: "Me dijeron que tengo una pierna más larga y que por eso me duele la espalda. ¿Es cierto?", author: "Anónimo", status: "publicada", answer: "Muchas personas tienen diferencias pequeñas entre ambos lados y no tienen dolor. Una diferencia por sí sola rara vez explica el dolor de espalda; lo importante es valorar cómo te mueves y qué actividades lo provocan. Si te preocupa, una evaluación funcional lo aclara.", suggestedServiceId: "s_eval", me2: 41, createdAt: iso },
      { id: "q2", topic: "Ciática", title: "Me dijeron que tengo ciática, ¿debo dejar de moverme?", body: "Tengo dolor que baja por la pierna. ¿Reposo total o seguir activo?", author: "Mariana", status: "publicada", answer: "En general el reposo prolongado no suele ayudar; mantenerse activo dentro de lo tolerable suele ser mejor. Cada caso es distinto: si hay pérdida de fuerza, adormecimiento que avanza o problemas para controlar esfínteres, acude a urgencias. Una valoración define qué ejercicios te convienen.", suggestedServiceId: "s_dolor", me2: 58, createdAt: iso },
      { id: "q3", topic: "Lesiones deportivas", title: "¿Cuándo puedo volver a correr después de un esguince?", body: "Hace tres semanas me torcí el tobillo, ya no me duele caminando.", author: "Luis H.", status: "publicada", answer: "No depende solo del tiempo, sino de criterios: movilidad completa, fuerza comparable con el otro lado y confianza al saltar y cambiar de dirección. Se vuelve de forma progresiva, no de golpe.", suggestedServiceId: "s_lesion", me2: 33, createdAt: iso },
      { id: "q4", topic: "Ejercicio y fuerza", title: "¿Es malo hacer sentadilla si me truenan las rodillas?", body: "Cuando bajo se escucha un tronido pero no duele.", author: "Anónimo", status: "publicada", answer: "El tronido sin dolor suele ser frecuente y no necesariamente indica daño. Si no duele ni se inflama, normalmente se puede seguir entrenando con buena técnica y carga progresiva. Si aparece dolor, conviene valorar.", suggestedServiceId: "s_dep", me2: 72, createdAt: iso },
      { id: "q5", topic: "Espalda y cuello", title: "Trabajo sentado ocho horas, ¿qué puedo hacer?", body: "Termino con el cuello cargado todos los días.", author: "Karen", status: "publicada", answer: "La mejor postura es la siguiente: cambiar de postura seguido. Pausas cortas cada 30 a 45 minutos, movilidad de cuello y hombros y algo de fuerza durante la semana ayudan mucho.", suggestedServiceId: "s_dolor", me2: 64, createdAt: iso },
      { id: "q6", topic: "Hombro", title: "¿El kinesiotape sirve para el hombro?", body: "Lo veo mucho en deportistas.", author: "Anónimo", status: "publicada", answer: "Puede ser un apoyo para algunas personas, pero no es la solución por sí solo. Lo que más cambia el resultado es identificar la causa y trabajar movilidad y fuerza.", suggestedServiceId: "s_rehab", me2: 27, createdAt: iso },
      { id: "q7", topic: "Rodilla", title: "Me duele la rodilla al bajar escaleras", body: "Desde hace dos meses, sobre todo al bajar. Soy corredor recreativo.", author: "Anónimo", status: "pendiente", me2: 0, createdAt: iso },
      { id: "q8", topic: "Espalda y cuello", title: "¿Sirve la faja para el dolor lumbar?", body: "Mi trabajo implica cargar cosas pesadas.", author: "Rodrigo", status: "pendiente", me2: 0, createdAt: iso },
    ],
    content: [
      { id: "c1", type: "video", title: "Los diagnósticos falsos en fisioterapia", description: "Por qué un estudio o una etiqueta no siempre explican tu dolor.", category: "Mitos", image: IMG.heroAlt, featured: true, published: true, createdAt: iso },
      { id: "c2", type: "video", title: "Ciática: qué sí y qué no hacer", description: "Ideas claras para moverte con confianza.", category: "Dolor", image: IMG.manualBw, featured: false, published: true, createdAt: iso },
      { id: "c3", type: "video", title: "Por qué importa este ejercicio", description: "Fuerza y control para proteger tus articulaciones.", category: "Ejercicios", image: IMG.barbell, featured: false, published: true, createdAt: iso },
      { id: "c4", type: "instagram", title: "Kinesiotape: ¿funciona?", description: "Reel del consultorio sobre el uso del vendaje neuromuscular.", category: "Mitos", url: BRAND.instagram, image: IMG.rackWoman, featured: false, published: true, createdAt: iso },
      { id: "c5", type: "instagram", title: "Dolor que normalizamos", description: "Entender el dolor antes de ignorarlo.", category: "Dolor", url: BRAND.instagram, image: IMG.rope, featured: false, published: true, createdAt: iso },
      { id: "c10", type: "instagram", title: "Cuando el dolor no se va", description: "Qué pasa cuando normalizamos una molestia durante meses.", category: "Dolor", url: BRAND.instagram, image: IMG.stretch, featured: false, published: true, createdAt: iso },
      { id: "c11", type: "consejo", title: "Después de una lesión: cuándo conviene valorarla", description: "Señales para no esperar de más y volver a tu actividad con un plan.", category: "Lesiones", image: IMG.runners, featured: false, published: true, createdAt: iso },
      { id: "c6", type: "consejo", title: "3 movimientos de cuello para la oficina", description: "Pausas de un minuto para aflojar tensión durante la jornada.", category: "Movilidad", image: IMG.yoga, featured: false, published: true, createdAt: iso },
      { id: "c7", type: "consejo", title: "Calentamiento antes de correr", description: "Una rutina corta para llegar mejor preparado a tu entrenamiento.", category: "Ejercicios", image: IMG.sunrise, featured: false, published: true, createdAt: iso },
      { id: "c8", type: "novedad", title: "Nuevos horarios los sábados", description: "Ejemplo de novedad del consultorio: agenda abierta los sábados por la mañana.", category: "Novedades", image: IMG.pilates, featured: false, published: true, createdAt: iso },
      { id: "c9", type: "novedad", title: "Borrador: Clínica de movilidad (ejemplo)", description: "Contenido en borrador, aún no visible en el sitio.", category: "Novedades", image: IMG.gym, featured: false, published: false, createdAt: iso },
    ],
    notices: [],
    audit: [],
    media: [],
    session: { role: "guest" },
  };
}

export interface ClinicalRecord {
  antecedentes: string;
  motivo: string;
  evaluacion: string;
  valoracion: string;
  plan: string;
  sesiones: { fecha: string; nota: string; evolucion: string; dolor: number; movilidad: number; fuerza: number }[];
  archivos: string[];
}

export function recordFor(patientId: string, today: string): ClinicalRecord {
  const d = (n: number) => addDays(today, n);
  const base: Record<string, ClinicalRecord> = {
    p_ana: {
      antecedentes: "Sin enfermedades crónicas referidas (dato ficticio). Practica entrenamiento de fuerza tres veces por semana.",
      motivo: "Molestia en hombro derecho al realizar movimientos por encima de la cabeza.",
      evaluacion: "Rango de movimiento conservado con dolor al final del arco. Fuerza ligeramente disminuida en rotación externa. Control escapular a mejorar.",
      valoracion: "Valoración funcional compatible con sobrecarga de hombro relacionada con el entrenamiento (texto ficticio de ejemplo).",
      plan: "Fase 1: control de carga y movilidad. Fase 2: fortalecimiento progresivo. Fase 3: retorno gradual a movimientos sobre la cabeza. Revisión cada 2 semanas.",
      sesiones: [
        { fecha: d(-23), nota: "Evaluación inicial y educación sobre carga.", evolucion: "Línea base", dolor: 7, movilidad: 55, fuerza: 50 },
        { fecha: d(-16), nota: "Control escapular y movilidad.", evolucion: "Mejora de rango sin dolor", dolor: 6, movilidad: 65, fuerza: 55 },
        { fecha: d(-9), nota: "Fortalecimiento de rotadores.", evolucion: "Menos molestia al elevar el brazo", dolor: 4, movilidad: 78, fuerza: 66 },
        { fecha: d(-4), nota: "Progresión de carga y patrón de empuje.", evolucion: "Buena tolerancia al ejercicio", dolor: 3, movilidad: 88, fuerza: 78 },
      ],
      archivos: ["Consentimiento_informado_DEMO.pdf", "Ejercicios_en_casa_fase1_DEMO.pdf"],
    },
    p_luis: {
      antecedentes: "Corredor de media maratón. Sin cirugías previas (dato ficticio).",
      motivo: "Dolor en cara externa de rodilla al correr más de 8 km.",
      evaluacion: "Dolor reproducible con flexión repetida de rodilla. Debilidad de glúteo medio en prueba funcional.",
      valoracion: "Hallazgos compatibles con dolor lateral de rodilla asociado a carga de entrenamiento (texto ficticio).",
      plan: "Ajuste de volumen de carrera, fortalecimiento de cadera y retorno progresivo por kilometraje.",
      sesiones: [{ fecha: d(-22), nota: "Valoración y plan.", evolucion: "Línea base", dolor: 6, movilidad: 60, fuerza: 55 }, { fecha: d(-15), nota: "Ajuste de carga de carrera.", evolucion: "Menos dolor al correr", dolor: 4, movilidad: 72, fuerza: 64 }],
      archivos: ["Plan_retorno_correr_DEMO.pdf"],
    },
  };
  return (
    base[patientId] ?? {
      antecedentes: "Sin datos capturados (expediente ficticio de ejemplo).",
      motivo: "Motivo de consulta de ejemplo.",
      evaluacion: "Evaluación inicial de ejemplo.",
      valoracion: "Valoración profesional de ejemplo (ficticia).",
      plan: "Plan de tratamiento de ejemplo.",
      sesiones: [{ fecha: d(-14), nota: "Sesión de ejemplo.", evolucion: "Línea base (ejemplo)", dolor: 6, movilidad: 60, fuerza: 55 }, { fecha: d(-7), nota: "Sesión de ejemplo.", evolucion: "Evolución favorable (ejemplo)", dolor: 4, movilidad: 72, fuerza: 66 }],
      archivos: [],
    }
  );
}

/** Ejercicios del plan de "Mi recuperación" (ficticios en la demo). */
export const EXERCISES = [
  { id: "e1", name: "Rotación externa con banda", detail: "3 series × 12 repeticiones" },
  { id: "e2", name: "Control escapular en pared", detail: "3 series × 10 repeticiones" },
  { id: "e3", name: "Movilidad de hombro con bastón", detail: "2 series × 8 repeticiones" },
];
export const PLAN_SESSIONS = 8; // sesiones previstas del plan (ficticio)
