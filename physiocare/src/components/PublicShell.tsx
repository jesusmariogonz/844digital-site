"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { BRAND, PRODUCT } from "@/lib/brand";
import { DemoOnly, useDemoUI } from "./DemoUI";
import { useStore } from "@/lib/store";
import { waLink, waMessage } from "@/lib/whatsapp";

const NAV = [
  ["/", "Inicio"], ["/sobre-mi", "Sobre mí"], ["/servicios", "Servicios"],
  ["/aprende", "Aprende"], ["/preguntas", "Pregúntale a Erik"], ["/contacto", "Contacto"],
] as const;

export function PublicShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const { db } = useStore();
  const demo = useDemoUI();
  const s = db.session;
  const wa = waLink(path);
  const [waOpen, setWaOpen] = useState(false);
  const account = s.role === "admin" ? "/admin" : s.role === "patient" ? "/cuenta" : "/ingresar";
  return (
    <>
      <DemoOnly>
        <div className="bg-amber text-ink text-center text-xs sm:text-sm font-bold py-1.5 px-3">
          Prototipo de demostración por {PRODUCT.agency} · Datos ficticios ·{" "}
          <Link href="/demo" className="underline">Guía de la demo</Link> ·{" "}
          <button onClick={() => demo.set(false)} className="underline">Ocultar avisos</button>
        </div>
      </DemoOnly>
      <header className="sticky top-0 z-50 bg-ink text-white border-b border-white/15">
        <div className="container-x flex items-center justify-between h-16">
          <Link href="/" aria-label="Inicio"><Logo /></Link>
          <nav className="hidden lg:flex items-stretch h-16 gap-7" aria-label="Principal">
            {NAV.map(([h, l]) => (
              <Link key={h} href={h} className={`flex items-center font-display text-[1.05rem] font-semibold uppercase tracking-[.1em] border-b-[3px] transition-colors ${path === h ? "border-amber text-white" : "border-transparent text-white/65 hover:text-white"}`}>{l}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href={account} className="hidden sm:inline font-display text-[1.05rem] font-semibold uppercase tracking-[.1em] text-white/80 hover:text-amber">
              {s.role === "guest" ? "Ingresar" : s.role === "admin" ? "Mi panel" : "Mi cuenta"}
            </Link>
            <Link href="/agendar?servicio=s_eval" className="btn btn-primary btn-sm"><span className="sm:hidden">Agendar</span><span className="hidden sm:inline">Agendar valoración</span></Link>
            <button className="lg:hidden size-10 grid place-items-center text-white" onClick={() => setOpen(!open)} aria-label="Menú" aria-expanded={open}>
              <span className="space-y-1.5"><i className="block w-6 h-0.5 bg-white" /><i className="block w-6 h-0.5 bg-white" /><i className="block w-4 h-0.5 bg-amber" /></span>
            </button>
          </div>
        </div>
        {open && (
          <div className="lg:hidden bg-ink border-t border-white/10 px-5 pb-6 pt-2 grid reveal">
            {NAV.map(([h, l]) => (
              <Link key={h} href={h} onClick={() => setOpen(false)} className="py-3.5 text-white font-display text-3xl font-extrabold uppercase border-b border-white/10">{l}</Link>
            ))}
            <Link href={account} onClick={() => setOpen(false)} className="py-3.5 text-amber font-display text-3xl font-extrabold uppercase">
              {s.role === "guest" ? "Ingresar" : "Mi cuenta"}
            </Link>
          </div>
        )}
      </header>
      <main>{children}</main>
      <footer className="bg-ink text-white/70 mt-28 sm:mt-40 pb-20 md:pb-0 overflow-hidden">
        <div className="container-x pt-16">
          <p className="font-display font-extrabold uppercase text-white leading-[.82] text-[3.4rem] sm:text-[8.5rem] lg:text-[11.5rem] tracking-[-.01em]">
            Erik Fitness<br /><span className="text-amber">and Rehab</span>
          </p>
        </div>
        <div className="container-x py-12 grid gap-10 md:grid-cols-12">
          <p className="md:col-span-5 max-w-sm text-sm">Fisioterapia y rendimiento en Saltillo, Coahuila. Lesiones deportivas, dolor y rehabilitación.
            <DemoOnly><span className="block mt-4 text-xs">Este sitio es un prototipo comercial con datos ficticios. La información de contacto es de ejemplo.</span></DemoOnly>
          </p>
          <div className="md:col-span-3 md:col-start-7">
            <h4 className="font-display text-lg text-amber uppercase font-bold tracking-[.15em] mb-3">Explora</h4>
            <ul className="space-y-1.5 text-sm">{NAV.map(([h, l]) => <li key={h}><Link href={h} className="hover:text-amber">{l}</Link></li>)}<li><Link href="/agendar?servicio=s_eval" className="hover:text-amber">Agendar valoración</Link></li></ul>
          </div>
          <div className="md:col-span-3">
            <h4 className="font-display text-lg text-amber uppercase font-bold tracking-[.15em] mb-3">Contacto</h4>
            <ul className="space-y-1.5 text-sm">
              <li><a href={BRAND.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-amber">Instagram {BRAND.igHandle}</a></li>
              <li><a href={wa} target="_blank" rel="noopener noreferrer" className="hover:text-amber">WhatsApp</a></li>
              <li>{BRAND.address}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/15 py-5 text-center text-xs">
          Plataforma <b className="text-white">{PRODUCT.name}</b> por <a className="text-amber font-bold" href={PRODUCT.agencyUrl} target="_blank" rel="noopener noreferrer">{PRODUCT.agency}</a> · Los resultados de la fisioterapia varían según cada persona.
        </div>
      </footer>
      <div className="md:hidden fixed z-40 inset-x-0 bottom-0 bg-ink border-t border-white/15 p-3 grid grid-cols-2 gap-3 pb-[max(.75rem,env(safe-area-inset-bottom))]">
        <a href={wa} target="_blank" rel="noopener noreferrer" className="btn !bg-[#25d366] !border-[#25d366] !text-ink">WhatsApp</a>
        <Link href="/agendar?servicio=s_eval" className="btn btn-primary">Agendar valoración</Link>
      </div>
      <div className="hidden md:block fixed z-40 right-0 top-1/2 -translate-y-1/2">
        {waOpen && (
          <div role="dialog" aria-label="Ayuda por WhatsApp" className="absolute right-full mr-3 top-1/2 -translate-y-1/2 w-80 bg-bone border-2 border-ink shadow-[6px_6px_0_var(--color-ink)] reveal">
            <div className="bg-ink text-white px-4 py-3 flex items-center justify-between"><b className="font-display text-lg uppercase tracking-wider">¿Necesitas ayuda?</b><button onClick={() => setWaOpen(false)} aria-label="Cerrar" className="text-xl leading-none">×</button></div>
            <div className="p-4"><p className="serif text-lg leading-snug">“{waMessage(path)}”</p></div>
            <div className="p-3 pt-0"><a href={wa} target="_blank" rel="noopener noreferrer" className="btn !bg-[#25d366] !border-[#25d366] !text-ink w-full">Abrir WhatsApp</a></div>
          </div>
        )}
        <button onClick={() => setWaOpen(!waOpen)} aria-expanded={waOpen} aria-label="Ayuda por WhatsApp" className="btn !bg-[#25d366] !border-[#25d366] !text-ink !px-2 !py-5 !tracking-[.25em] [writing-mode:vertical-rl] rotate-180">
          WhatsApp
        </button>
      </div>
    </>
  );
}
