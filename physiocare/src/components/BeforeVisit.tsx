import Link from "next/link";

const ITEMS = [
  "Llega 10 minutos antes",
  "Trae ropa cómoda para moverte",
  "Si tienes estudios previos, tráelos",
  "Evita llegar justo después de entrenar",
  "Puedes cancelar o reprogramar desde tu cuenta",
];

export function BeforeVisit({ dark, cta }: { dark?: boolean; cta?: boolean }) {
  return (
    <section className={`rounded-3xl p-6 ${dark ? "bg-white/10 text-white" : "card"}`} aria-labelledby="antes-cita">
      <h2 id="antes-cita" className="font-display text-3xl font-extrabold uppercase">Antes de tu cita</h2>
      <ul className="mt-3 space-y-2">
        {ITEMS.map((i) => <li key={i} className="flex gap-3 border-b border-current/15 pb-2"><span className="text-amber font-bold">—</span>{i}</li>)}
      </ul>
      {cta && <Link href="/cuenta" className="btn btn-outline btn-sm mt-5">Tengo una cita</Link>}
    </section>
  );
}
