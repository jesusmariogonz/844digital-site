import Link from "next/link";
import { IMG } from "@/lib/images";
import { Img } from "@/components/ui";
import { PROFILE } from "@/lib/seed";

export const metadata = { title: "Sobre mí" };

const LISTS: [string, string[]][] = [
  ["Formación académica", PROFILE.education],
  ["Certificaciones", PROFILE.certifications],
  ["Experiencia", PROFILE.experience],
];

export default function SobreMi() {
  const stats = [
    [PROFILE.years && `+${PROFILE.years}`, "años de experiencia"],
    [PROFILE.patients && `+${PROFILE.patients}`, "pacientes atendidos"],
    [PROFILE.specialty, "especialidad"],
    [PROFILE.location, "consultorio"],
  ].filter(([v]) => v);
  const lists = LISTS.filter(([, items]) => items.length > 0);

  return (
    <div className="container-x pt-14">
      <div className="grid md:grid-cols-5 gap-10 items-start">
        <div className="md:col-span-2 md:sticky md:top-24">
          <div className="rounded-3xl overflow-hidden aspect-[4/5]"><Img src={IMG.heroAlt} alt={PROFILE.name} /></div>
        </div>
        <div className="md:col-span-3">
          <div className="eyebrow">Sobre mí</div>
          <h1 className="section-title mt-2">{PROFILE.name}</h1>
          <p className="mt-2 font-display text-2xl font-bold uppercase text-brand">{PROFILE.role}</p>
          <p className="mt-5 text-xl text-slate-700">{PROFILE.pitch}</p>

          <dl className="mt-8 grid grid-cols-2 gap-4">
            {stats.map(([v, l]) => (
              <div key={l as string} className="card p-5"><dt className="font-display text-3xl font-extrabold leading-none">{v}</dt><dd className="text-sm text-slate-500 mt-1">{l}</dd></div>
            ))}
          </dl>

          {lists.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              {lists.map(([t, items]) => (
                <div key={t} className="card p-5">
                  <h2 className="font-display text-2xl font-extrabold uppercase">{t}</h2>
                  <ul className="mt-2 space-y-1.5 text-sm text-slate-700">{items.map((i) => <li key={i} className="flex gap-2"><span className="text-brand font-bold">✓</span>{i}</li>)}</ul>
                </div>
              ))}
            </div>
          )}

          {PROFILE.philosophy && (
            <div className="card-dark p-6 mt-4">
              <h2 className="font-display text-2xl font-extrabold uppercase text-amber">Filosofía de atención</h2>
              <p className="mt-2 text-white/80">{PROFILE.philosophy}</p>
            </div>
          )}

          <div className="mt-8 flex gap-3 flex-wrap"><Link href="/agendar?servicio=s_eval" className="btn btn-primary">Agendar valoración</Link><Link href="/aprende" className="btn btn-outline">Aprende sobre tu cuerpo</Link></div>
        </div>
      </div>
    </div>
  );
}
