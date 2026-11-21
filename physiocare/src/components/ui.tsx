"use client";
import Link from "next/link";
import { useEffect } from "react";
import type { ApptStatus, PayStatus } from "@/lib/types";
import { useDemoUI } from "./DemoUI";

export type Flag = "demo" | "pendiente" | "config" | "proxima";
const FLAGS: Record<Flag, { t: string; c: string }> = {
  demo: { t: "Disponible en la demo", c: "bg-emerald-100 text-emerald-800" },
  pendiente: { t: "Integración pendiente", c: "bg-amber-100 text-amber-800" },
  config: { t: "Requiere configuración", c: "bg-sky-100 text-sky-800" },
  proxima: { t: "Próxima implementación", c: "bg-violet-100 text-violet-800" },
};
export function FlagBadge({ flag, dark, always }: { flag: Flag; dark?: boolean; always?: boolean }) {
  const { show } = useDemoUI();
  if (!show && !always) return null;
  const f = FLAGS[flag];
  return (
    <span className={`chip ${dark ? "bg-white/10 text-white" : f.c}`}>
      <span className="size-1.5 rounded-full bg-current" />
      {f.t}
    </span>
  );
}

const AS: Record<ApptStatus, [string, string]> = {
  pendiente: ["Pendiente", "bg-amber-100 text-amber-800"],
  confirmada: ["Confirmada", "bg-emerald-100 text-emerald-800"],
  completada: ["Completada", "bg-slate-200 text-slate-700"],
  cancelada: ["Cancelada", "bg-red-100 text-red-700"],
  no_asistio: ["No asistió", "bg-orange-100 text-orange-800"],
};
export const StatusChip = ({ s }: { s: ApptStatus }) => <span className={`chip ${AS[s][1]}`}>{AS[s][0]}</span>;

const PS: Record<PayStatus, [string, string]> = {
  sin_pago: ["Sin pago", "bg-slate-100 text-slate-600"],
  anticipo: ["Anticipo pagado", "bg-sky-100 text-sky-800"],
  pagado: ["Pagado", "bg-emerald-100 text-emerald-800"],
  reembolsado: ["Reembolsado", "bg-violet-100 text-violet-800"],
  fallido: ["Pago fallido", "bg-red-100 text-red-700"],
};
export const PayChip = ({ s }: { s: PayStatus }) => <span className={`chip ${PS[s][1]}`}>{PS[s][0]}</span>;

export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <button aria-label="Cerrar" className="absolute inset-0 bg-ink/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white w-full ${wide ? "sm:max-w-3xl" : "sm:max-w-lg"} max-h-[92vh] overflow-auto rounded-t-3xl sm:rounded-3xl p-6 reveal`}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <h3 className="font-display text-3xl font-extrabold uppercase leading-none">{title}</h3>
          <button onClick={onClose} className="size-9 rounded-full bg-mist grid place-items-center font-bold" aria-label="Cerrar">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <div className="border-2 border-dashed border-mist rounded-2xl p-8 text-center text-slate-500">{children}</div>;
}

export function Stat({ label, value, hint, accent }: { label: string; value: string | number; hint?: string; accent?: boolean }) {
  return (
    <div className={`p-5 ${accent ? "bg-ink text-white" : "card"}`}>
      <div className={`font-display text-sm font-bold uppercase tracking-[.16em] ${accent ? "text-amber" : "text-slate-500"}`}>{label}</div>
      <div className="font-display font-extrabold text-6xl leading-none mt-2">{value}</div>
      {hint && <div className={`text-sm mt-2 ${accent ? "text-white/70" : "text-slate-500"}`}>{hint}</div>}
    </div>
  );
}

export function Img({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" className={`photo w-full h-full object-cover ${className}`} />;
}

export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="font-display text-base font-bold uppercase tracking-[.12em] ulink">{children}</Link>;
}

export function PageHead({ title, sub, flag, children }: { title: string; sub?: string; flag?: Flag; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
      <div>
        <h1 className="font-display text-5xl sm:text-6xl font-extrabold uppercase leading-[.88]">{title}</h1>
        {sub && <p className="text-slate-600 mt-2 max-w-2xl">{sub}</p>}
        {flag && <div className="mt-2"><FlagBadge flag={flag} /></div>}
      </div>
      <div className="flex gap-2 flex-wrap">{children}</div>
    </div>
  );
}
