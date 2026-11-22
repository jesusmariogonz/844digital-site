import type { ReactNode } from "react";

export function SectionHead({ eyebrow, title, children, light, h1 }: { eyebrow: string; title: string; children?: ReactNode; light?: boolean; h1?: boolean }) {
  const H = h1 ? "h1" : "h2";
  return (
    <div className="grid lg:grid-cols-12 gap-6 items-end mb-12">
      <div className="lg:col-span-8">
        <div className={`eyebrow ${light ? "!text-amber" : ""}`}>{eyebrow}</div>
        <H className={`section-title mt-4 ${light ? "text-white" : ""}`}>{title}</H>
      </div>
      {children && <p className={`lg:col-span-4 text-lg ${light ? "text-white/75" : "text-slate-700"}`}>{children}</p>}
    </div>
  );
}
