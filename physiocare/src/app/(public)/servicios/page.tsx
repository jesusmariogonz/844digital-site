"use client";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { ServiceCard, SectionHead } from "@/components/cards";
import { ServiceFinder } from "@/components/ServiceFinder";

export default function Servicios() {
  const { db } = useStore();
  const list = db.services.filter((s) => s.active);
  return (
    <div className="container-x pt-14">
      <SectionHead h1 eyebrow="Catálogo" title="Servicios de fisioterapia">Cada plan empieza con una valoración. Los resultados varían en cada persona.</SectionHead>
      <ServiceFinder />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{list.map((s) => <ServiceCard key={s.id} s={s} full />)}</div>
      <div className="mt-12 card p-6 flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-xl text-slate-600">¿Dudas? Empieza con una <b>valoración funcional</b>.</p>
        <Link href="/agendar?servicio=s_eval" className="btn btn-primary">Agendar valoración</Link>
      </div>
    </div>
  );
}
