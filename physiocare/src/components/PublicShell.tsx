"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { BRAND } from "@/lib/seed";
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
  const s = db.session;
  const wa = waLink(path);
  const [waOpen, setWaOpen] = useState(false);
  return (
    <>
      <div className="bg-amber text-ink text-center text-xs sm:text-sm font-bold py-1.5 px-3">
        Prototipo de demostración por 844 Digital · Datos ficticios ·{" "}
        <Link href="/demo" className="underline">Recorrer la demo</Link>
      </div>
      <header className="sticky top-0 z-50 bg-ink/90 backdrop-blur-md border-b border-white/10">
        <div className="container-x flex items-center justify-between h-16">
          <Link href="/" aria-label="Inicio"><Logo /></Link>
          <nav className="hidden lg:flex items-center gap-1" aria-label="Principal">
            {NAV.map(([h, l]) => (
              <Link key={h} href={h} className={`px-3 py-2 rounded-full text-sm font-semibold transition ${path === h ? "bg-white/10 text-amber" : "text-white/80 hover:text-white"}`}>{l}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link href={s.role === "admin" ? "/admin" : s.role === "patient" ? "/cuenta" : "/ingresar"} className="hidden sm:inline-flex btn btn-ghost btn-sm">
              {s.role === "guest" ? "Ingresar" : s.role === "admin" ? "Mi panel" : "Mi cuenta"}
            </Link>
            <Link href="/agendar?servicio=s_eval" className="btn btn-primary btn-sm"><span className="sm:hidden">Agendar</span><span className="hidden sm:inline">Agendar valoración</span></Link>
            <button className="lg:hidden size-10 grid place-items-center text-white" onClick={() => setOpen(!open)} aria-label="Menú" aria-expanded={open}>
              <span className="space-y-1.5"><i className="block w-6 h-0.5 bg-white" /><i className="block w-6 h-0.5 bg-white" /><i className="block w-4 h-0.5 bg-white" /></span>
            </button>
          </div>
        </div>
        {open && (
          <div className="lg:hidden bg-ink border-t border-white/10 px-5 pb-5 pt-2 grid gap-1 reveal">
            {NAV.map(([h, l]) => (
              <Link key={h} href={h} onClick={() => setOpen(false)} className="py-3 text-white font-display text-2xl font-bold uppercase border-b border-white/5">{l}</Link>
            ))}
            <Link href={s.role === "admin" ? "/admin" : s.role === "patient" ? "/cuenta" : "/ingresar"} onClick={() => setOpen(false)} className="py-3 text-amber font-display text-2xl font-bold uppercase">
              {s.role === "guest" ? "Ingresar" : "Mi cuenta"}
            </Link>
          </div>
        )}
      </header>
      <main>{children}</main>
      <footer className="bg-ink text-white/70 mt-24 pb-20 md:pb-0">
        <div className="container-x py-14 grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm">Fisioterapia y rendimiento en Saltillo, Coahuila. Lesiones deportivas, dolor y rehabilitación.</p>
            <p className="mt-4 text-xs">Este sitio es un prototipo comercial con datos ficticios. La información de contacto es de ejemplo.</p>
          </div>
          <div>
            <h4 className="font-display text-xl text-white uppercase font-bold mb-3">Explora</h4>
            <ul className="space-y-2 text-sm">{NAV.map(([h, l]) => <li key={h}><Link href={h} className="hover:text-amber">{l}</Link></li>)}<li><Link href="/agendar?servicio=s_eval" className="hover:text-amber">Agendar valoración</Link></li></ul>
          </div>
          <div>
            <h4 className="font-display text-xl text-white uppercase font-bold mb-3">Contacto</h4>
            <ul className="space-y-2 text-sm">
              <li><a href={BRAND.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-amber">Instagram {BRAND.igHandle}</a></li>
              <li><a href={wa} target="_blank" rel="noopener noreferrer" className="hover:text-amber">WhatsApp</a></li>
              <li>{BRAND.address}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center text-xs">
          Diseño y desarrollo por <a className="text-amber font-bold" href="https://844digital.com" target="_blank" rel="noopener noreferrer">844 Digital</a> · Prototipo de demostración · Los resultados de la fisioterapia varían según cada persona.
        </div>
      </footer>
      <div className="md:hidden fixed z-40 inset-x-0 bottom-0 bg-ink/95 backdrop-blur border-t border-white/10 p-3 grid grid-cols-2 gap-3 pb-[max(.75rem,env(safe-area-inset-bottom))]">
        <a href={wa} target="_blank" rel="noopener noreferrer" className="btn !bg-[#25d366] !text-ink">WhatsApp</a>
        <Link href="/agendar?servicio=s_eval" className="btn btn-primary">Agendar valoración</Link>
      </div>
      <div className="hidden md:block fixed z-40 bottom-5 right-5">
        {waOpen && (
          <div role="dialog" aria-label="Ayuda por WhatsApp" className="absolute bottom-[4.5rem] right-0 w-80 rounded-2xl bg-white shadow-2xl border border-mist overflow-hidden reveal">
            <div className="bg-[#075e54] text-white px-4 py-3 flex items-center justify-between"><b>¿Necesitas ayuda?</b><button onClick={() => setWaOpen(false)} aria-label="Cerrar" className="text-xl leading-none">×</button></div>
            <div className="p-4 bg-[#efeae2]"><div className="rounded-xl rounded-tl-none bg-white p-3 text-sm shadow-sm">{waMessage(path)}</div></div>
            <div className="p-3"><a href={wa} target="_blank" rel="noopener noreferrer" className="btn !bg-[#25d366] !text-ink w-full">Abrir WhatsApp</a></div>
          </div>
        )}
        <button onClick={() => setWaOpen(!waOpen)} aria-expanded={waOpen} aria-label="Ayuda por WhatsApp" className="size-14 rounded-full bg-[#25d366] grid place-items-center shadow-xl pulse-ring hover:scale-110 transition">
          <svg viewBox="0 0 32 32" className="size-8 fill-white" aria-hidden="true"><path d="M16 3C9 3 3.3 8.6 3.3 15.5c0 2.3.7 4.5 1.8 6.3L3 29l7.4-1.9a12.9 12.9 0 0 0 5.6 1.3c7 0 12.7-5.600 12.7-12.500S23 3 16 3zm0 23.300c-1.800 0-3.600-.5-5.100-1.400l-.4-.2-4.400 1.100 1.200-4.200-.3-.4a10.400 10.400 0 0 1-1.600-5.600C5.400 9.800 10.100 5.200 16 5.200S26.600 9.800 26.600 15.600 21.900 26.300 16 26.300zm5.800-7.800c-.3-.2-1.900-.9-2.200-1s-.5-.2-.7.200-.8 1-1 1.200-.4.200-.7.100a8.700 8.700 0 0 1-4.300-3.800c-.3-.6.300-.5.900-1.700.1-.2 0-.4 0-.5l-1-2.300c-.3-.6-.5-.5-.7-.5h-.6a1.200 1.200 0 0 0-.9.400 3.700 3.700 0 0 0-1.100 2.700 6.400 6.400 0 0 0 1.400 3.400c.2.200 2.400 3.700 5.800 5.100 2.200.9 3 .9 4 .8.600-.1 1.900-.8 2.200-1.600s.3-1.400.2-1.600-.3-.3-.7-.5z"/></svg>
        </button>
      </div>
    </>
  );
}
