import { Suspense } from "react";
import { BookingFlow } from "@/components/BookingFlow";

export const metadata = { title: "Agendar una cita" };

export default function Agendar() {
  return (
    <Suspense fallback={<div className="container-x pt-20 text-slate-500">Cargando agenda…</div>}>
      <BookingFlow />
    </Suspense>
  );
}
