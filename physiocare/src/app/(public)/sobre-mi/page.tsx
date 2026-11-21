import Link from "next/link";
import { IMG } from "@/lib/images";
import { Img } from "@/components/ui";
import { SectionHead } from "@/components/cards";

export const metadata = { title: "Sobre mí" };

const FIELDS: [string, string][] = [
  ["Formación académica", "Campo editable: Erik capturará aquí su formación."],
  ["Certificaciones", "Campo editable: cursos y certificaciones verificables."],
  ["Especialidades", "Lesiones deportivas y dolor · Rehabilitación y rendimiento (según su perfil público)."],
  ["Experiencia", "Campo editable: trayectoria profesional."],
];

export default function SobreMi() {
  return (
    <div className="container-x pt-14">
      <div className="grid md:grid-cols-5 gap-10 items-start">
        <div className="md:col-span-2 md:sticky md:top-24">
          <div className="rounded-3xl overflow-hidden aspect-[4/5] relative">
            <Img src={IMG.heroAlt} alt="Fotografía de stock; se reemplaza por la de Erik" />
            <span className="absolute bottom-3 left-3 chip bg-ink/80 text-white">Foto de stock</span>
          </div>
        </div>
        <div className="md:col-span-3">
          <SectionHead h1 eyebrow="Sobre mí" title="Erik Esqueda">Fisioterapeuta y entrenador personal en Saltillo, Coahuila.</SectionHead>
          <div className="card p-6">
            <h3 className="font-display text-2xl font-extrabold uppercase">Biografía</h3>
            <p className="mt-2 text-slate-600">Erik se enfoca en lesiones deportivas y dolor, y en rehabilitación combinada con rendimiento. Comparte contenido educativo en Instagram para que las personas entiendan su cuerpo y su dolor. <i>La biografía completa es un campo editable que Erik redactará.</i></p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            {FIELDS.map(([t, d]) => (
              <div key={t} className="card p-5">
                <h3 className="font-display text-xl font-extrabold uppercase">{t}</h3>
                <p className="text-sm text-slate-600 mt-1">{d}</p>
                <span className="chip bg-sky-100 text-sky-800 mt-3">Requiere configuración</span>
              </div>
            ))}
          </div>
          <div className="card-dark p-6 mt-4">
            <h3 className="font-display text-2xl font-extrabold uppercase text-amber">Filosofía de atención</h3>
            <p className="mt-2 text-white/80">Explicar con claridad, mover con propósito y acompañar cada etapa. Sin promesas milagrosas: tu proceso importa. <i className="text-white/50">(Texto de ejemplo editable.)</i></p>
          </div>
          <div className="mt-8 flex gap-3 flex-wrap"><Link href="/agendar" className="btn btn-primary">Agendar una cita</Link><Link href="/aprende" className="btn btn-outline">Aprende y conoce</Link></div>
        </div>
      </div>
    </div>
  );
}
