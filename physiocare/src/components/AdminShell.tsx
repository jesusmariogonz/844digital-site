"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { useStore } from "@/lib/store";
import { DemoOnly } from "./DemoUI";
import { PRODUCT } from "@/lib/brand";
import { fmtTime, shortDate } from "@/lib/dates";

const NAV = [
  ["/admin", "Resumen", "▦"], ["/admin/agenda", "Agenda", "◷"], ["/admin/pacientes", "Pacientes", "☺"],
  ["/admin/servicios", "Servicios", "✚"], ["/admin/contenido", "Consola de contenido", "▶"],
  ["/admin/preguntas", "Preguntas", "?"], ["/admin/pagos", "Pagos", "$"],
  ["/admin/notificaciones", "Notificaciones", "✉"], ["/admin/integraciones", "Integraciones", "⚙"],
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const { db, ready, logout, loginAs } = useStore();
  const [open, setOpen] = useState(false);
  const pending = db.questions.filter((q) => q.status === "pendiente").length;

  // Aviso en vivo: cuando entra una cita nueva (de otra pestaña o del sitio) aparece una tarjeta.
  const seen = useRef<Set<string> | null>(null);
  const [toast, setToast] = useState<{ id: string; who: string; what: string; when: string } | null>(null);
  useEffect(() => {
    if (!ready) return;
    const ids = new Set(db.appointments.map((a) => a.id));
    if (seen.current) {
      const fresh = db.appointments.find((a) => !seen.current!.has(a.id) && a.source !== "manual");
      if (fresh) {
        const p = db.patients.find((x) => x.id === fresh.patientId);
        const sv = db.services.find((x) => x.id === fresh.serviceId);
        setToast({ id: fresh.id, who: p?.name.split(" (")[0] ?? "Paciente", what: sv?.name ?? "Cita", when: `${shortDate(fresh.date)} · ${fmtTime(fresh.time)}` });
      }
    }
    seen.current = ids;
  }, [db.appointments, db.patients, db.services, ready]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 9000); return () => clearTimeout(t); }, [toast]);

  if (!ready) return <div className="min-h-screen bg-bone grid place-items-center text-slate-500">Cargando panel…</div>;
  if (db.session.role !== "admin") {
    return (
      <div className="min-h-screen bg-ink grid place-items-center p-6">
        <div className="card p-8 max-w-md text-center">
          <Logo dark={false} />
          <h1 className="font-display text-4xl font-extrabold uppercase mt-5">Panel del fisioterapeuta</h1>
          <p className="text-slate-600 mt-2">Acceso restringido. En esta demo puedes entrar con la cuenta de administrador ficticia.</p>
          <button className="btn btn-primary w-full mt-6" onClick={() => loginAs("admin")}>Entrar como Erik (demo)</button>
          <Link href="/" className="block mt-3 text-sm font-bold text-brand">← Volver al sitio</Link>
        </div>
      </div>
    );
  }

  const nav = (
    <nav className="grid gap-1" aria-label="Panel">
      {NAV.map(([h, l, i]) => {
        const on = h === "/admin" ? path === h : path.startsWith(h);
        return (
          <Link key={h} href={h} onClick={() => setOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition ${on ? "bg-amber text-ink" : "text-white/75 hover:bg-white/10"}`}>
            <span className="w-5 text-center">{i}</span>{l}
            {l === "Preguntas" && pending > 0 && <span className="ml-auto chip bg-brand text-white !px-2">{pending}</span>}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen lg:flex bg-bone">
      {toast && (
        <div role="status" aria-live="polite" className="fixed z-[90] top-4 right-4 left-4 sm:left-auto sm:w-96 reveal">
          <div className="rounded-2xl bg-ink text-white p-4 shadow-2xl border border-amber/40 flex gap-3 items-start">
            <span className="mt-1 size-3 rounded-full bg-amber shrink-0 pulse-ring" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold uppercase tracking-wider text-amber">Nueva cita</div>
              <div className="font-display text-2xl font-extrabold uppercase leading-none mt-1">{toast.who}</div>
              <div className="text-sm text-white/80 mt-1">{toast.what} · {toast.when}</div>
              <Link href="/admin/agenda" onClick={() => setToast(null)} className="inline-block mt-2 text-sm font-bold text-amber underline">Ver en la agenda</Link>
            </div>
            <button onClick={() => setToast(null)} aria-label="Cerrar aviso" className="text-white/60 hover:text-white text-xl leading-none">×</button>
          </div>
        </div>
      )}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-ink p-4 sticky top-0 h-screen">
        <Link href="/admin" className="px-2 py-3"><Logo /></Link>
        <div className="mt-4 flex-1 overflow-auto">{nav}</div>
        <div className="rounded-xl bg-white/5 p-3 text-xs text-white/60 mb-3"><DemoOnly><span>Sesión demo · datos ficticios<br /></span></DemoOnly>{PRODUCT.name} · {PRODUCT.agency}</div>
        <Link href="/" className="btn btn-ghost btn-sm mb-2">Ver sitio público</Link>
        <button className="btn btn-ghost btn-sm" onClick={() => { logout(); router.push("/"); }}>Cerrar sesión</button>
      </aside>
      <div className="flex-1 min-w-0">
        <header className="lg:hidden sticky top-0 z-40 bg-ink flex items-center justify-between px-4 h-14">
          <Logo small />
          <button className="text-white text-2xl px-2" onClick={() => setOpen(!open)} aria-label="Menú del panel" aria-expanded={open}>☰</button>
        </header>
        {open && <div className="lg:hidden bg-ink p-4 sticky top-14 z-40 max-h-[75vh] overflow-auto">{nav}<button className="btn btn-ghost btn-sm w-full mt-3" onClick={() => { logout(); router.push("/"); }}>Cerrar sesión</button></div>}
        <DemoOnly><div className="bg-amber text-ink text-xs font-bold text-center py-1">Panel de demostración · datos ficticios · no se guarda información real</div></DemoOnly>
        <main className="p-4 sm:p-8 max-w-7xl">{children}</main>
      </div>
    </div>
  );
}
