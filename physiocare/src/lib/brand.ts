/**
 * MARCA DEL PRODUCTO Y DEL CLIENTE: todo lo que cambia al adaptar la plataforma a otro negocio.
 * Para ofrecer el producto a otro profesional (DentalCare, VetCare...) se cambia este archivo,
 * los colores en src/app/globals.css (@theme) y el catálogo de servicios en src/lib/seed.ts.
 */

/** El producto de la agencia. */
export const PRODUCT = {
  name: "PhysioCare",
  tagline: "Tu consultorio. Tu agenda. Tus pacientes.",
  agency: "844 Digital",
  agencyUrl: "https://844digital.com",
  verticals: ["PhysioCare", "DentalCare", "BeautyCare", "VetCare", "MedicalCare"],
};

/** El cliente actual. */
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
