"use client";
import { useState } from "react";
import Link from "next/link";
import { BRAND } from "@/lib/seed";
import { FlagBadge } from "@/components/ui";
import { SectionHead } from "@/components/cards";

const HOURS = [["Lunes a viernes", "9:00 – 14:00 y 15:00 – 19:00"], ["Sábado", "9:00 – 13:00"], ["Domingo", "Cerrado"]];

export default function Contacto() {
  const [sent, setSent] = useState(false);
  const wa = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent("Hola Erik, tengo una duda.")}`;
  return (
    <div className="container-x pt-14">
      <SectionHead h1 eyebrow="Agenda y contacto" title="Hablemos">Datos de contacto de ejemplo; se reemplazan por los reales al configurar el sitio.</SectionHead>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="card p-6">
            <h3 className="font-display text-2xl font-extrabold uppercase">Horarios de atención</h3>
            <dl className="mt-3 divide-y divide-mist">{HOURS.map(([d, h]) => <div key={d} className="flex justify-between py-2"><dt className="font-semibold">{d}</dt><dd className="text-slate-600">{h}</dd></div>)}</dl>
            <p className="text-xs text-slate-500 mt-2">Zona horaria: Saltillo, Coahuila (hora del centro).</p>
          </div>
          <div className="card p-6 grid sm:grid-cols-2 gap-3">
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-blue">WhatsApp</a>
            <a href={BRAND.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-outline">Instagram</a>
            <a href={`tel:${BRAND.phone.replace(/\s/g, "")}`} className="btn btn-outline">Llamar {BRAND.phone}</a>
            <Link href="/agendar" className="btn btn-primary">Agendar cita</Link>
          </div>
          <div className="card overflow-hidden">
            <iframe title="Mapa de Saltillo, Coahuila" loading="lazy" className="w-full h-72 border-0" src="https://www.google.com/maps?q=Saltillo,+Coahuila&output=embed" referrerPolicy="no-referrer-when-downgrade" />
            <div className="p-4 text-sm flex items-center justify-between gap-2 flex-wrap"><span>{BRAND.address}</span><FlagBadge flag="config" /></div>
          </div>
        </div>
        <div className="card p-6 self-start">
          <h3 className="font-display text-3xl font-extrabold uppercase">Escríbeme</h3>
          <div className="mt-1"><FlagBadge flag="demo" /> <FlagBadge flag="pendiente" /></div>
          {sent ? (
            <div className="mt-5 rounded-2xl bg-emerald-50 text-emerald-900 p-5">Gracias. En esta demo el mensaje no se envía a ningún servidor; en producción llegaría al correo y WhatsApp de Erik. <button className="underline font-bold ml-1" onClick={() => setSent(false)}>Enviar otro</button></div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="mt-4 space-y-3">
              <div><label className="label" htmlFor="cn">Nombre</label><input id="cn" required className="input" /></div>
              <div><label className="label" htmlFor="ce">Correo</label><input id="ce" type="email" required className="input" /></div>
              <div><label className="label" htmlFor="ct">Teléfono (opcional)</label><input id="ct" type="tel" className="input" /></div>
              <div><label className="label" htmlFor="cm">Mensaje</label><textarea id="cm" required rows={5} className="input" /></div>
              <button className="btn btn-primary w-full">Enviar mensaje</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
