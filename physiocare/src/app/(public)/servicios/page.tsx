"use client";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { SectionHead } from "@/components/cards";
import { ServiceFinder } from "@/components/ServiceFinder";
import { ServiceIndex } from "@/components/ServiceIndex";

export default function Servicios() {
  const { db } = useStore();
  const list = db.services.filter((s) => s.active);
  return (
    <div className="container-x pt-14 sm:pt-20">
      <SectionHead h1 eyebrow="Catálogo" title="Servicios de fisioterapia">
        Cada plan empieza con una valoración. Los resultados varían en cada persona.
      </SectionHead>
      <ServiceFinder />
      <ServiceIndex services={list} detailed />
      <div className="mt-16 rule pt-8 flex flex-wrap items-center justify-between gap-6">
        <p className="serif text-3xl">¿Dudas? Empieza con una valoración funcional.</p>
        <Link href="/agendar?servicio=s_eval" className="btn btn-primary">Agendar valoración</Link>
      </div>
    </div>
  );
}
