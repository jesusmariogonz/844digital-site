"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { useStore } from "@/lib/store";

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
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-ink p-4 sticky top-0 h-screen">
        <Link href="/admin" className="px-2 py-3"><Logo /></Link>
        <div className="mt-4 flex-1 overflow-auto">{nav}</div>
        <div className="rounded-xl bg-white/5 p-3 text-xs text-white/60 mb-3">Sesión demo · datos ficticios<br />Prototipo de 844 Digital</div>
        <Link href="/" className="btn btn-ghost btn-sm mb-2">Ver sitio público</Link>
        <button className="btn btn-ghost btn-sm" onClick={() => { logout(); router.push("/"); }}>Cerrar sesión</button>
      </aside>
      <div className="flex-1 min-w-0">
        <header className="lg:hidden sticky top-0 z-40 bg-ink flex items-center justify-between px-4 h-14">
          <Logo small />
          <button className="text-white text-2xl px-2" onClick={() => setOpen(!open)} aria-label="Menú del panel" aria-expanded={open}>☰</button>
        </header>
        {open && <div className="lg:hidden bg-ink p-4 sticky top-14 z-40 max-h-[75vh] overflow-auto">{nav}<button className="btn btn-ghost btn-sm w-full mt-3" onClick={() => { logout(); router.push("/"); }}>Cerrar sesión</button></div>}
        <div className="bg-amber text-ink text-xs font-bold text-center py-1">Panel de demostración · datos ficticios · no se guarda información real</div>
        <main className="p-4 sm:p-8 max-w-7xl">{children}</main>
      </div>
    </div>
  );
}
