import { BRAND } from "./seed";

const BASE = "Hola Erik, vi tu sitio web";
const BY_PATH: [string, string][] = [
  ["/agendar", `${BASE} y tengo una duda para agendar mi valoración.`],
  ["/servicios", `${BASE} y me gustaría saber qué servicio me conviene.`],
  ["/preguntas", `${BASE} y tengo una pregunta sobre mi caso.`],
  ["/aprende", `${BASE} y me gustaría agendar una valoración después de ver tu contenido.`],
  ["/contacto", `${BASE} y quiero comunicarme contigo.`],
  ["/cuenta", `${BASE} y necesito ayuda con mi cita.`],
];
/** Mensaje prellenado según la página donde está la persona. */
export function waMessage(path: string): string {
  return BY_PATH.find(([p]) => path.startsWith(p))?.[1] ?? `${BASE} y me gustaría agendar una valoración de fisioterapia.`;
}
export function waLink(path: string): string {
  return `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(waMessage(path))}`;
}
