"use client";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { IMG } from "@/lib/images";
import { Img } from "@/components/ui";
import { ServiceCard, SectionHead } from "@/components/cards";

const TESTIMONIALS = [
  { n: "Paciente de ejemplo 1", t: "Llegué sin saber qué tenía y salí con un plan claro. Me explicó todo sin tecnicismos.", d: "Corredor recreativo" },
  { n: "Paciente de ejemplo 2", t: "Agendar fue facilísimo desde el celular y el recordatorio por WhatsApp me salvó el día.", d: "Oficinista" },
  { n: "Paciente de ejemplo 3", t: "Me acompañó en mi regreso al gimnasio paso a paso, sin prisas.", d: "Entrenamiento de fuerza" },
];

export default function Home() {
  const { db } = useStore();
  const services = db.services.filter((s) => s.active).slice(0, 4);
  const qs = db.questions.filter((q) => q.status === "publicada").sort((a, b) => b.me2 - a.me2).slice(0, 3);
  return (
    <>
      {/* HERO */}
      <section className="relative bg-ink text-white overflow-hidden">
        <div className="absolute inset-0"><Img src={IMG.hero} alt="Entrenamiento de alta intensidad" className="opacity-45" /></div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/20" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bone to-transparent" />
        <div className="container-x relative pt-16 pb-44 sm:pt-24 sm:pb-52">
          <span className="chip bg-white/10 text-amber reveal">Fisioterapia · Rendimiento · Saltillo</span>
          <h1 className="reveal d1 mt-5 font-display font-extrabold uppercase text-[3.6rem] sm:text-8xl leading-[.88] max-w-3xl">
            Muévete sin dolor.<br /><span className="text-amber">Vuelve a rendir.</span>
          </h1>
          <p className="reveal d2 mt-6 text-lg sm:text-xl text-white/80 max-w-xl">
            Valoración, tratamiento y acompañamiento para lesiones deportivas, dolor y rehabilitación. Agenda en línea en menos de un minuto.
          </p>
          <div className="reveal d3 mt-8 flex flex-wrap gap-3">
            <Link href="/agendar" className="btn btn-primary text-lg">Agendar una cita</Link>
            <Link href="/servicios" className="btn btn-ghost text-lg">Conoce mis servicios</Link>
          </div>
          <dl className="reveal d4 mt-12 grid grid-cols-3 max-w-lg gap-4 text-white">
            {[["16 mil+", "comunidad en Instagram"], ["1 min", "para agendar"], ["24/7", "agenda en línea"]].map(([a, b]) => (
              <div key={b}><dt className="font-display text-4xl font-extrabold text-amber leading-none">{a}</dt><dd className="text-xs text-white/70 mt-1">{b}</dd></div>
            ))}
          </dl>
        </div>
      </section>

      {/* VALORES */}
      <section className="container-x -mt-24 relative z-10 grid gap-4 md:grid-cols-3">
        {[
          ["01", "Valoración clara", "Entiendes qué te pasa y qué sigue, con lenguaje simple."],
          ["02", "Plan a tu medida", "Ejercicio y técnicas según tu lesión y tu objetivo."],
          ["03", "Seguimiento real", "Tu historial, citas y pagos en un solo lugar."],
        ].map(([n, t, d]) => (
          <div key={n} className="card p-6 hover-lift">
            <div className="font-display text-5xl font-extrabold text-brand/25 leading-none">{n}</div>
            <h3 className="font-display text-2xl font-extrabold uppercase mt-2">{t}</h3>
            <p className="text-slate-600 mt-1">{d}</p>
          </div>
        ))}
      </section>

      {/* SERVICIOS */}
      <section className="container-x mt-24">
        <SectionHead eyebrow="Servicios destacados" title="Tratamiento para moverte mejor">
          Cada plan parte de una valoración. Los resultados dependen de cada persona y no se garantizan.
        </SectionHead>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">{services.map((s) => <ServiceCard key={s.id} s={s} />)}</div>
        <div className="mt-8 text-center"><Link href="/servicios" className="btn btn-outline">Ver todos los servicios</Link></div>
      </section>

      {/* SOBRE ERIK */}
      <section className="mt-24 bg-ink text-white">
        <div className="container-x py-20 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-3xl overflow-hidden aspect-[4/5] zoom">
            <Img src={IMG.heroAlt} alt="Foto de ejemplo — sustituir por fotografía de Erik" />
            <span className="absolute bottom-3 left-3 chip bg-ink/80 text-white">Foto de stock · se reemplaza por la real</span>
          </div>
          <div>
            <div className="eyebrow !text-amber">Conoce a tu fisioterapeuta</div>
            <h2 className="section-title mt-2">Erik Esqueda</h2>
            <p className="mt-5 text-lg text-white/80">Fisioterapeuta y entrenador personal en Saltillo. Su enfoque: lesiones deportivas y dolor, rehabilitación y rendimiento, explicado de forma cercana y sin complicaciones.</p>
            <p className="mt-3 text-sm text-white/50">La biografía, formación y certificaciones son campos editables que Erik completará con su información real.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/sobre-mi" className="btn btn-primary">Sobre mí</Link>
              <Link href="/preguntas" className="btn btn-ghost">Hazme una pregunta</Link>
            </div>
          </div>
        </div>
      </section>

      {/* PREGUNTAS */}
      <section className="container-x mt-24">
        <SectionHead eyebrow="Pregúntale a Erik" title="Lo que todos quieren saber">Preguntas reales de la comunidad, moderadas y respondidas por Erik.</SectionHead>
        <div className="grid md:grid-cols-3 gap-5">
          {qs.map((q) => (
            <Link key={q.id} href="/preguntas" className="card p-6 hover-lift block">
              <span className="chip bg-brand/10 text-brand">{q.topic}</span>
              <h3 className="font-display text-2xl font-extrabold leading-tight mt-3">{q.title}</h3>
              <p className="text-sm text-slate-600 mt-2 line-clamp-3">{q.answer}</p>
              <div className="mt-4 text-sm font-bold text-brand">Leer respuesta →</div>
            </Link>
          ))}
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="container-x mt-24">
        <SectionHead eyebrow="Testimonios" title="Lo que dicen los pacientes">Contenido ficticio de demostración. Se sustituye por testimonios reales con autorización de cada paciente.</SectionHead>
        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <figure key={t.n} className="card p-6">
              <div className="text-amber text-xl">★★★★★</div>
              <blockquote className="mt-3 text-lg">“{t.t}”</blockquote>
              <figcaption className="mt-4 text-sm text-slate-500"><b className="text-ink">{t.n}</b> · {t.d} <span className="chip bg-slate-100 text-slate-600 ml-1">Ejemplo</span></figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-x mt-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-brand text-white p-10 sm:p-16">
          <div className="absolute -right-10 -bottom-16 font-display font-extrabold text-[16rem] leading-none text-white/10 select-none">EFR</div>
          <h2 className="section-title max-w-2xl relative">Tu siguiente paso empieza con una valoración</h2>
          <p className="mt-4 text-lg text-white/85 max-w-xl relative">Elige servicio, día y hora. Recibe confirmación y recordatorios.</p>
          <Link href="/agendar" className="btn btn-primary mt-8 text-lg relative">Agendar una cita</Link>
        </div>
      </section>
    </>
  );
}
