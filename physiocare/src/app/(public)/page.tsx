"use client";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { IMG } from "@/lib/images";
import { Img } from "@/components/ui";
import { ServiceIndex } from "@/components/ServiceIndex";
import { PROFILE, BRAND } from "@/lib/brand";
import { DemoOnly } from "@/components/DemoUI";

const AREAS = ["Fisioterapia deportiva", "Rehabilitación", "Dolor musculoesquelético", "Rendimiento", "Lesiones", "Retorno al entrenamiento"];
const pad = (n: number) => String(n).padStart(2, "0");

export default function Home() {
  const { db } = useStore();
  const services = db.services.filter((s) => s.active).slice(0, 5);
  const reels = db.content.filter((c) => c.published && c.type === "instagram" && c.url).slice(0, 3);
  const qs = db.questions.filter((q) => q.status === "publicada").sort((a, b) => b.me2 - a.me2).slice(0, 3);
  const [firstReview, ...otherReviews] = PROFILE.reviews;
  const stats = [
    [PROFILE.years && `+${PROFILE.years}`, "años de experiencia"],
    [PROFILE.patients && `+${PROFILE.patients}`, "pacientes atendidos"],
    [PROFILE.followers, "en Instagram"],
    [PROFILE.location, "consultorio"],
  ].filter(([v]) => v) as [string, string][];

  return (
    <>
      {/* HERO */}
      <section className="bg-ink text-white overflow-hidden">
        <div className="container-x grid lg:grid-cols-12 gap-10 pt-14 pb-20 lg:pt-20 lg:pb-28 items-end">
          <div className="lg:col-span-7 relative z-10">
            <p className="eyebrow !text-amber reveal">{PROFILE.name} / {PROFILE.location}</p>
            <h1 className="reveal d1 mt-6 font-display font-extrabold uppercase text-[3.3rem] sm:text-[5.8rem] xl:text-[7.2rem] leading-[.86]">
              Fisioterapia<br />para<br />
              <span className="serif block text-amber normal-case font-medium text-[.6em] leading-[1.05] my-[.12em]">volver a moverte,</span>
              entrenar y rendir.
            </h1>
            <p className="reveal d2 mt-8 max-w-md text-lg text-white/75">Valoración, tratamiento y acompañamiento personalizado para lesiones, dolor y rendimiento físico.</p>
            <div className="reveal d3 mt-9 flex flex-wrap items-center gap-x-9 gap-y-4">
              <Link href="/agendar?servicio=s_eval" className="btn btn-primary !px-9 !py-4 !text-xl">Agendar valoración</Link>
              <Link href="/servicios" className="ulink font-display text-xl font-semibold uppercase tracking-[.1em]">Conocer servicios</Link>
            </div>
          </div>
          <div className="lg:col-span-5 reveal d2">
            <div className="relative lg:translate-y-8">
              <div className="absolute inset-0 translate-x-3 translate-y-3 border-2 border-amber" aria-hidden="true" />
              <div className="relative grain aspect-[4/5] bg-ink-2"><Img src={IMG.hero} alt="" /></div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/15">
          <div className="container-x py-4 flex flex-wrap gap-x-9 gap-y-1 font-display uppercase tracking-[.16em] text-[.95rem] text-white/65">
            {AREAS.slice(0, 4).map((a) => <span key={a}>{a}</span>)}
          </div>
        </div>
      </section>

      {/* CINTA */}
      <div className="bg-amber text-ink overflow-hidden border-y-2 border-ink" aria-hidden="true">
        <div className="ticker py-3">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0">
              {AREAS.map((a) => <span key={a} className="font-display text-3xl sm:text-4xl font-extrabold uppercase px-6 whitespace-nowrap">{a}<span className="mx-6 font-medium">/</span></span>)}
            </div>
          ))}
        </div>
      </div>

      {/* SERVICIOS */}
      <section className="container-x mt-24 sm:mt-36">
        <div className="grid lg:grid-cols-12 gap-6 items-end mb-12">
          <div className="lg:col-span-8">
            <p className="eyebrow">Servicios</p>
            <h2 className="section-title mt-4">Tratamiento para <span className="serif lowercase font-medium text-brand">moverte</span> mejor</h2>
          </div>
          <p className="lg:col-span-4 text-lg text-slate-700">Cada plan empieza con una valoración. Los resultados varían en cada persona.</p>
        </div>
        <ServiceIndex services={services} />
        <div className="mt-12 flex flex-wrap items-center gap-x-9 gap-y-4">
          <Link href="/servicios" className="btn btn-outline">Ver todos los servicios</Link>
          <Link href="/servicios#asistente" className="ulink font-display text-xl font-semibold uppercase tracking-[.1em]">¿Cuál necesito?</Link>
        </div>
      </section>

      {/* SOBRE ERIK */}
      <section className="container-x mt-28 sm:mt-44 grid lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-5 lg:pt-20">
          <div className="relative">
            <div className="grain aspect-[4/5] bg-ink"><Img src={IMG.heroAlt} alt={PROFILE.name} /></div>
            <p className="absolute -bottom-5 -right-2 sm:-right-6 bg-amber text-ink font-display uppercase font-bold tracking-[.14em] px-5 py-2.5 text-lg">{PROFILE.name}</p>
          </div>
        </div>
        <div className="lg:col-span-7">
          <p className="eyebrow">{PROFILE.role}</p>
          <blockquote className="serif mt-7 text-[2.3rem] sm:text-6xl leading-[1.04]">“{PROFILE.pitch}”</blockquote>
          <dl className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-8 rule pt-6">
            {stats.map(([v, l]) => (
              <div key={l}><dt className="font-display text-4xl sm:text-5xl font-extrabold leading-none">{v}</dt><dd className="text-sm text-slate-600 mt-2">{l}</dd></div>
            ))}
          </dl>
          <div className="mt-10 flex flex-wrap items-center gap-x-9 gap-y-4">
            <Link href="/agendar?servicio=s_eval" className="btn btn-primary">Agendar valoración</Link>
            <Link href="/sobre-mi" className="ulink font-display text-xl font-semibold uppercase tracking-[.1em]">Conoce más</Link>
          </div>
        </div>
      </section>

      {/* DE INSTAGRAM AL CONSULTORIO */}
      <section className="mt-28 sm:mt-44 bg-ink text-white overflow-hidden" aria-labelledby="ig-t">
        <div className="container-x py-20 sm:py-28 grid lg:grid-cols-12 gap-14 items-center">
          <div className="lg:col-span-5">
            <p className="eyebrow !text-amber">Instagram / Consultorio</p>
            <h2 id="ig-t" className="section-title mt-5 text-white">De Instagram al consultorio</h2>
            <p className="mt-6 text-white/80 text-lg max-w-md">Contenido que ya ayuda a miles de personas. Ahora también puedes agendar tu valoración.</p>
            <div className="mt-8 flex items-end gap-4"><span className="font-display text-7xl font-extrabold text-amber leading-[.8]">{PROFILE.followers}</span><span className="text-white/65 text-sm leading-tight pb-1">seguidores en<br />{BRAND.igHandle}</span></div>
            <div className="mt-9 flex flex-wrap items-center gap-x-9 gap-y-4"><Link href="/agendar?servicio=s_eval" className="btn btn-primary">Agendar valoración</Link><a href={BRAND.instagram} target="_blank" rel="noopener noreferrer" className="ulink font-display text-xl font-semibold uppercase tracking-[.1em]">Seguir en Instagram</a></div>
          </div>
          <div className="lg:col-span-7 grid grid-cols-3 gap-3 sm:gap-6 items-start">
            {reels.map((c, i) => (
              <a key={c.id} href={c.url} target="_blank" rel="noopener noreferrer" className={`block zoom ${i === 1 ? "mt-10 sm:mt-16" : i === 2 ? "mt-4 sm:mt-6" : ""}`}>
                <div className="grain aspect-[9/16] bg-ink-2"><Img src={c.image} alt={c.title} /></div>
                <div className="mt-3 border-t-2 border-amber pt-2"><div className="font-display text-sm text-amber font-bold uppercase tracking-[.14em]">{c.category}</div><div className="font-display text-xl sm:text-2xl font-extrabold uppercase leading-[.95] mt-1">{c.title}</div></div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* PREGÚNTALE A ERIK */}
      <section className="container-x mt-28 sm:mt-44">
        <div className="grid lg:grid-cols-12 gap-6 items-end mb-10">
          <div className="lg:col-span-8">
            <p className="eyebrow">Pregúntale a Erik</p>
            <h2 className="section-title mt-4">La comunidad pregunta. <span className="serif normal-case font-medium text-brand">Erik responde.</span></h2>
          </div>
          <p className="lg:col-span-4 text-lg text-slate-700">Preguntas moderadas y respondidas por Erik Esqueda, fisioterapeuta.</p>
        </div>
        <ol className="rule">
          {qs.map((q, i) => (
            <li key={q.id} className="rule-b">
              <Link href="/preguntas" className="grid sm:grid-cols-12 gap-x-6 gap-y-3 py-8 hover-lift">
                <span className="sm:col-span-1 font-display text-xl text-slate-500">{pad(i + 1)}</span>
                <div className="sm:col-span-6">
                  <span className="label !mb-2">{q.topic}</span>
                  <h3 className="font-display text-3xl sm:text-[2.6rem] font-extrabold uppercase leading-[.92]">{q.title}</h3>
                </div>
                <p className="sm:col-span-5 serif text-xl text-slate-700 line-clamp-3">{q.answer}</p>
              </Link>
            </li>
          ))}
        </ol>
        <Link href="/preguntas" className="btn btn-outline mt-10">Ver todas las preguntas</Link>
      </section>

      {/* RESEÑAS: de ejemplo mientras no existan reseñas reales y autorizadas */}
      {firstReview && (
        <section className="container-x mt-28 sm:mt-44">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <p className="eyebrow">Reseñas</p>
              <h2 className="font-display text-4xl sm:text-5xl font-extrabold uppercase leading-[.9] mt-4">Lo que dicen mis pacientes</h2>
              {PROFILE.reviewsRating && (
                <div className="mt-8"><span className="font-display font-extrabold text-8xl leading-none">{PROFILE.reviewsRating}</span><span className="font-display text-3xl text-slate-500">/5</span><p className="text-sm text-slate-600 mt-2">promedio en reseñas</p></div>
              )}
              {PROFILE.reviewsAreDemo && <DemoOnly><span className="chip bg-ink text-amber mt-4">Reseñas de ejemplo (demo)</span></DemoOnly>}
            </div>
            <div className="lg:col-span-8">
              <figure>
                <blockquote className="serif text-[2rem] sm:text-5xl leading-[1.08]">“{firstReview.text}”</blockquote>
                <figcaption className="mt-5 font-display uppercase tracking-[.14em] text-sm"><b>{firstReview.name}</b> / {firstReview.detail}</figcaption>
              </figure>
              <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8 rule mt-12 pt-8">
                {otherReviews.map((r, i) => (
                  <figure key={i}>
                    <blockquote className="serif text-2xl leading-snug">“{r.text}”</blockquote>
                    <figcaption className="mt-3 font-display uppercase tracking-[.14em] text-sm"><b>{r.name}</b> / {r.detail}</figcaption>
                  </figure>
                ))}
              </div>
              {PROFILE.reviewsAreDemo && <DemoOnly><p className="mt-6 text-xs text-slate-500">Reseñas ficticias de demostración. Se sustituyen por reseñas reales de pacientes, con su autorización.</p></DemoOnly>}
            </div>
          </div>
        </section>
      )}

      {/* CIERRE */}
      <section className="container-x mt-28 sm:mt-44">
        <div className="rule pt-10 grid lg:grid-cols-12 gap-10 items-end">
          <h2 className="lg:col-span-9 font-display font-extrabold uppercase leading-[.82] text-[3.5rem] sm:text-[7.6rem]">Tu siguiente paso empieza con una <span className="serif lowercase font-medium text-brand">valoración</span></h2>
          <div className="lg:col-span-3">
            <p className="text-slate-700 mb-5">Elige servicio, día y hora. Recibe confirmación y recordatorios.</p>
            <Link href="/agendar?servicio=s_eval" className="btn btn-primary !py-4 !text-xl w-full">Agendar valoración</Link>
          </div>
        </div>
      </section>
    </>
  );
}
