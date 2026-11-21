"use client";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { IMG } from "@/lib/images";
import { Img } from "@/components/ui";
import { ServiceCard, SectionHead } from "@/components/cards";
import { PROFILE, BRAND } from "@/lib/brand";
import { DemoOnly } from "@/components/DemoUI";

export default function Home() {
  const { db } = useStore();
  const services = db.services.filter((s) => s.active).slice(0, 4);
  const reels = db.content.filter((c) => c.published && c.type === "instagram" && c.url).slice(0, 3);
  const qs = db.questions.filter((q) => q.status === "publicada").sort((a, b) => b.me2 - a.me2).slice(0, 3);
  return (
    <>
      {/* HERO */}
      <section className="relative bg-ink text-white overflow-hidden">
        <div className="absolute inset-0"><Img src={IMG.hero} alt="" className="opacity-45" /></div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/20" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bone to-transparent" />
        <div className="container-x relative pt-14 pb-44 sm:pt-24 sm:pb-52">
          <span className="chip bg-white/10 text-amber reveal">{PROFILE.name} · {PROFILE.location}</span>
          <h1 className="reveal d1 mt-5 font-display font-extrabold uppercase text-[3.2rem] sm:text-8xl leading-[.9] max-w-4xl">
            Fisioterapia para <span className="text-amber">volver a moverte,</span> entrenar y rendir.
          </h1>
          <p className="reveal d2 mt-6 text-lg sm:text-xl text-white/80 max-w-xl">
            Valoración, tratamiento y acompañamiento personalizado para lesiones, dolor y rendimiento físico.
          </p>
          <div className="reveal d3 mt-8 flex flex-wrap gap-3">
            <Link href="/agendar?servicio=s_eval" className="btn btn-primary text-lg sm:text-xl !px-8 !py-4">Agendar valoración</Link>
            <Link href="/servicios" className="btn btn-ghost text-lg">Conocer servicios</Link>
          </div>
          <ul className="reveal d4 mt-8 flex flex-wrap gap-2" aria-label="Áreas de atención">
            {["Fisioterapia deportiva", "Rehabilitación", "Dolor musculoesquelético", "Rendimiento"].map((t) => (
              <li key={t} className="chip bg-white/10 text-white/90 border border-white/15">{t}</li>
            ))}
          </ul>
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
        <SectionHead eyebrow="Servicios" title="Tratamiento para moverte mejor">
          Cada plan parte de una valoración. Los resultados varían en cada persona.
        </SectionHead>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">{services.map((s) => <ServiceCard key={s.id} s={s} />)}</div>
        <div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/servicios#asistente" className="btn btn-blue">¿Cuál necesito?</Link><Link href="/servicios" className="btn btn-outline">Ver todos los servicios</Link></div>
      </section>

      {/* SOBRE ERIK */}
      <section className="mt-24 bg-ink text-white">
        <div className="container-x py-20 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-3xl overflow-hidden aspect-[4/5] zoom">
            <Img src={IMG.heroAlt} alt={PROFILE.name} />
          </div>
          <div>
            <div className="eyebrow !text-amber">{PROFILE.role}</div>
            <h2 className="section-title mt-2">{PROFILE.name}</h2>
            <p className="mt-5 text-xl text-white/85">{PROFILE.pitch}</p>
            <dl className="mt-7 grid grid-cols-2 gap-4">
              {[[PROFILE.years && `+${PROFILE.years}`, "años de experiencia"], [PROFILE.patients && `+${PROFILE.patients}`, "pacientes atendidos"], [PROFILE.followers, "en Instagram"], [PROFILE.location, "consultorio"]]
                .filter(([v]) => v).map(([v, l]) => (
                  <div key={l as string} className="border-l-2 border-amber pl-3"><dt className="font-display text-3xl font-extrabold leading-none">{v}</dt><dd className="text-sm text-white/60 mt-1">{l}</dd></div>
                ))}
            </dl>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/agendar?servicio=s_eval" className="btn btn-primary">Agendar valoración</Link>
              <Link href="/sobre-mi" className="btn btn-ghost">Conoce más</Link>
            </div>
          </div>
        </div>
      </section>

      {/* DE INSTAGRAM AL CONSULTORIO */}
      <section className="container-x mt-24" aria-labelledby="ig-t">
        <div className="rounded-[2rem] bg-ink text-white overflow-hidden grid lg:grid-cols-5">
          <div className="lg:col-span-2 p-8 sm:p-10 flex flex-col justify-center">
            <div className="eyebrow !text-amber">Instagram → Consultorio</div>
            <h2 id="ig-t" className="section-title mt-2">De Instagram al consultorio</h2>
            <p className="mt-4 text-white/80 text-lg">Contenido que ya ayuda a miles de personas. Ahora también puedes agendar tu valoración.</p>
            <div className="mt-5 flex items-center gap-3"><span className="font-display text-5xl font-extrabold text-amber leading-none">{PROFILE.followers}</span><span className="text-white/70 text-sm leading-tight">seguidores en<br />{BRAND.igHandle}</span></div>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Temas">{["Mitos", "Dolor", "Ejercicios"].map((t) => <li key={t} className="chip bg-white/10 border border-white/15">{t}</li>)}</ul>
            <div className="mt-7 flex flex-wrap gap-3"><Link href="/agendar?servicio=s_eval" className="btn btn-primary">Agendar valoración</Link><a href={BRAND.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">Seguir en Instagram</a></div>
          </div>
          <div className="lg:col-span-3 p-6 sm:p-8 grid grid-cols-3 gap-3 sm:gap-4 content-center bg-ink-2">
            {reels.map((c) => (
              <a key={c.id} href={c.url} target="_blank" rel="noopener noreferrer" className="relative rounded-2xl overflow-hidden aspect-[9/16] zoom block group">
                <Img src={c.image} alt={c.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                <span className="absolute top-2 right-2 chip bg-ink/80 text-white !px-2">Reel</span>
                <div className="absolute inset-x-0 bottom-0 p-3"><div className="font-display text-lg sm:text-xl font-extrabold uppercase leading-none">{c.title}</div><div className="text-[.7rem] text-amber font-bold mt-1">{c.category}</div></div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* PREGUNTAS */}
      <section className="container-x mt-24">
        <SectionHead eyebrow="Pregúntale a Erik" title="La comunidad pregunta. Erik responde.">Preguntas moderadas y respondidas por Erik Esqueda, fisioterapeuta.</SectionHead>
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

      {/* RESEÑAS: de ejemplo mientras no existan reseñas reales y autorizadas */}
      {PROFILE.reviews.length > 0 && (
        <section className="container-x mt-24">
          <div className="max-w-3xl mb-10">
            <div className="eyebrow">Reseñas</div>
            <h2 className="section-title mt-2">Lo que dicen mis pacientes</h2>
            <div className="mt-4 flex items-center gap-3 flex-wrap">
              {PROFILE.reviewsRating && (
                <div className="flex items-center gap-2"><span className="font-display text-5xl font-extrabold leading-none">{PROFILE.reviewsRating}</span><span><span className="text-amber text-xl block leading-none" aria-hidden="true">★★★★★</span><span className="text-sm text-slate-500">de 5 en reseñas</span></span></div>
              )}
              {PROFILE.reviewsAreDemo && <DemoOnly><span className="chip bg-slate-100 text-slate-600">Reseñas de ejemplo (demo)</span></DemoOnly>}
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {PROFILE.reviews.map((r, i) => (
              <figure key={i} className="card p-6 hover-lift">
                <div className="text-amber text-xl" role="img" aria-label={`${r.stars} de 5 estrellas`}>{"★".repeat(r.stars)}</div>
                <blockquote className="mt-3 text-lg">“{r.text}”</blockquote>
                <figcaption className="mt-4 text-sm text-slate-500"><b className="text-ink">{r.name}</b> · {r.detail}</figcaption>
              </figure>
            ))}
          </div>
          {PROFILE.reviewsAreDemo && <DemoOnly><p className="mt-4 text-xs text-slate-500">Reseñas ficticias de demostración. Se sustituyen por reseñas reales de pacientes, con su autorización.</p></DemoOnly>}
        </section>
      )}

      {/* CTA */}
      <section className="container-x mt-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-brand text-white p-10 sm:p-16">
          <div className="absolute -right-10 -bottom-16 font-display font-extrabold text-[16rem] leading-none text-white/10 select-none">EFR</div>
          <h2 className="section-title max-w-2xl relative">Tu siguiente paso empieza con una valoración</h2>
          <p className="mt-4 text-lg text-white/85 max-w-xl relative">Elige servicio, día y hora. Recibe confirmación y recordatorios.</p>
          <Link href="/agendar?servicio=s_eval" className="btn btn-primary mt-8 text-lg relative">Agendar valoración</Link>
        </div>
      </section>
    </>
  );
}
