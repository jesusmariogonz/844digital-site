"use client";
import { useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { FlagBadge, Img, PageHead, Empty } from "@/components/ui";
import { Player } from "@/components/Player";
import { parseYouTube } from "@/lib/youtube";
import { IMG } from "@/lib/images";
import { uid } from "@/lib/dates";
import type { ContentItem, ContentType } from "@/lib/types";

const TYPES: [ContentType, string][] = [["video", "Video de YouTube"], ["instagram", "Publicación de Instagram"], ["consejo", "Consejo de movilidad"], ["novedad", "Novedad del consultorio"]];
const fmtSize = (n: number) => (n > 1e6 ? `${(n / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1e3))} KB`);

export default function Consola() {
  const { db, upsertContent, removeContent, addMedia, removeMedia } = useStore();
  const [tab, setTab] = useState<"nuevo" | "biblioteca" | "medios">("nuevo");
  const [drag, setDrag] = useState(false);
  const [note, setNote] = useState("");
  const [f, setF] = useState({ type: "video" as ContentType, title: "", description: "", category: "", link: "", image: IMG.heroAlt, featured: false });
  const [ok, setOk] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const yt = parseYouTube(f.link);
  const gallery = [...db.media.filter((m) => m.dataUrl).map((m) => [m.name, m.dataUrl!] as const), ...Object.entries(IMG)];
  const preview: ContentItem = { id: "prev", type: f.type, title: f.title || "Título del video", description: f.description, category: f.category, youtubeId: yt ?? undefined, image: f.image, featured: false, published: true, createdAt: "" };

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    setNote("");
    Array.from(files).forEach((file) => {
      const kind = file.type.startsWith("image/") ? "imagen" : file.type.startsWith("video/") ? "video" : "documento";
      if (kind === "imagen" && file.size <= 1_500_000) {
        const r = new FileReader();
        r.onload = () => addMedia({ name: file.name, kind, size: file.size, dataUrl: String(r.result) });
        r.readAsDataURL(file);
      } else {
        addMedia({ name: file.name, kind, size: file.size });
        if (kind === "imagen") setNote("Algunas imágenes superan 1.5 MB: se registran sin vista previa en la demo.");
      }
    });
    setNote((n) => n || "Archivos agregados a la demo (solo en este navegador). Para guardarlos de forma permanente se conecta almacenamiento en la nube.");
  };

  const publish = (e: React.FormEvent) => {
    e.preventDefault();
    if (f.type === "video" && !yt) return setOk("El enlace de YouTube no es válido.");
    upsertContent({
      id: uid("c"), type: f.type, title: f.title, description: f.description, category: f.category || "General",
      youtubeId: f.type === "video" ? yt ?? undefined : undefined, url: f.type === "instagram" ? f.link : undefined,
      image: f.image, featured: f.featured, published: true, createdAt: new Date().toISOString(),
    });
    setOk("¡Publicado! Ya aparece en «Aprende y conoce» del sitio público.");
    setF({ ...f, title: "", description: "", link: "", featured: false });
  };

  return (
    <>
      <PageHead title="Consola de contenido" sub="Sube tus fotos y videos, pega enlaces de YouTube o Instagram y publica sin depender de nadie." flag="demo" />
      <div className="flex gap-2 mb-5 scroll-x">{([["nuevo", "Publicar contenido"], ["biblioteca", `Biblioteca (${db.content.length})`], ["medios", `Mis archivos (${db.media.length})`]] as const).map(([k, l]) => <button key={k} onClick={() => setTab(k)} className={`btn btn-sm ${tab === k ? "btn-blue" : "btn-outline"}`}>{l}</button>)}</div>

      {tab === "nuevo" && (
        <div className="grid xl:grid-cols-2 gap-6">
          <form onSubmit={publish} className="card p-6 grid gap-3 self-start">
            <div><label className="label" htmlFor="ct">Tipo</label><select id="ct" className="input" value={f.type} onChange={(e) => setF({ ...f, type: e.target.value as ContentType })}>{TYPES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></div>
            {(f.type === "video" || f.type === "instagram") && (
              <div><label className="label" htmlFor="cl">{f.type === "video" ? "Enlace de YouTube" : "Enlace de la publicación"}</label><input id="cl" required type="url" className="input" placeholder={f.type === "video" ? "https://www.youtube.com/watch?v=…" : "https://www.instagram.com/p/…"} value={f.link} onChange={(e) => setF({ ...f, link: e.target.value })} />
                {f.type === "video" && f.link && <p className={`text-xs mt-1 font-semibold ${yt ? "text-emerald-700" : "text-red-600"}`}>{yt ? "Enlace reconocido" : "No reconocemos este enlace"}</p>}</div>
            )}
            <div><label className="label" htmlFor="ctt">Título</label><input id="ctt" required className="input" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></div>
            <div><label className="label" htmlFor="cd">Descripción</label><textarea id="cd" required rows={3} className="input" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></div>
            <div><label className="label" htmlFor="cc">Categoría</label><datalist id="cats">{["Ejercicios", "Dolor", "Lesiones", "Mitos", "Movilidad", "Novedades"].map((c) => <option key={c} value={c} />)}</datalist><input id="cc" list="cats" className="input" placeholder="Ejercicios, Dolor, Lesiones, Mitos…" value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} /></div>
            <div><label className="label">Portada (elige de tus archivos o del banco de fotos)</label><div className="grid grid-cols-5 gap-2 max-h-40 overflow-auto">{gallery.map(([n, u]) => <button key={n + u.slice(-12)} type="button" onClick={() => setF({ ...f, image: u })} className={`aspect-square rounded-lg overflow-hidden border-2 ${f.image === u ? "border-amber" : "border-transparent"}`} aria-label={`Portada ${n}`}><Img src={u} alt={n} /></button>)}</div></div>
            {f.type === "video" && <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.featured} onChange={(e) => setF({ ...f, featured: e.target.checked })} /> Mostrar como video destacado</label>}
            {ok && <p className="rounded-xl bg-emerald-50 text-emerald-800 text-sm p-3">{ok}</p>}
            <button className="btn btn-primary">Publicar en el sitio</button>
          </form>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Vista previa</div>
            {f.type === "video" ? <Player item={preview} /> : <div className="aspect-video rounded-2xl overflow-hidden"><Img src={f.image} alt="Portada" /></div>}
            <h3 className="font-display text-3xl font-extrabold uppercase mt-3 leading-none">{f.title || "Tu título aquí"}</h3>
            <p className="text-slate-600 mt-1">{f.description || "La descripción se verá así en la tarjeta."}</p>
          </div>
        </div>
      )}

      {tab === "biblioteca" && (
        <div className="space-y-3">
          {db.content.map((c) => (
            <div key={c.id} className="card p-3 flex flex-wrap items-center gap-4">
              <div className="w-28 aspect-video rounded-lg overflow-hidden shrink-0"><Img src={c.image} alt="" /></div>
              <div className="flex-1 min-w-48"><div className="font-bold">{c.title}</div><div className="text-xs text-slate-500">{TYPES.find((t) => t[0] === c.type)?.[1]} · {c.category}{c.youtubeId ? " · con reproductor" : ""}</div></div>
              <span className={`chip ${c.published ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"}`}>{c.published ? "Publicado" : "Borrador"}</span>
              <div className="flex gap-2">
                <button className="btn btn-outline btn-sm" onClick={() => upsertContent({ ...c, published: !c.published })}>{c.published ? "Pasar a borrador" : "Publicar"}</button>
                {c.type === "video" && <button className="btn btn-outline btn-sm" onClick={() => upsertContent({ ...c, featured: !c.featured })}>{c.featured ? "Quitar destacado" : "Destacar"}</button>}
                <button className="btn btn-danger btn-sm" onClick={() => confirm("¿Eliminar este contenido?") && removeContent(c.id)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "medios" && (
        <div>
          <div onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={(e) => { e.preventDefault(); setDrag(false); onFiles(e.dataTransfer.files); }}
            className={`rounded-3xl border-2 border-dashed p-10 text-center transition ${drag ? "border-brand bg-brand/10" : "border-slate-300 bg-white"}`}>
            <div className="font-display text-xl font-bold uppercase tracking-[.2em] text-slate-400">Subir</div>
            <p className="font-display text-3xl font-extrabold uppercase mt-2">Arrastra tus fotos y videos aquí</p>
            <p className="text-slate-600 text-sm mt-1">o selecciónalos desde tu teléfono o computadora</p>
            <button className="btn btn-primary mt-4" onClick={() => fileRef.current?.click()}>Elegir archivos</button>
            <input ref={fileRef} type="file" multiple accept="image/*,video/*,.pdf" className="sr-only" aria-label="Elegir archivos" onChange={(e) => { onFiles(e.target.files); e.target.value = ""; }} />
            <div className="mt-3 flex justify-center gap-2 flex-wrap"><FlagBadge flag="demo" /><FlagBadge flag="pendiente" /></div>
            {note && <p className="mt-3 text-sm text-slate-600">{note}</p>}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
            {db.media.map((m) => (
              <div key={m.id} className="card overflow-hidden">
                <div className="aspect-square bg-mist grid place-items-center">{m.dataUrl ? <Img src={m.dataUrl} alt={m.name} /> : <span className="font-display text-2xl font-bold uppercase tracking-[.15em] text-slate-500">{m.kind === "video" ? "Video" : "Doc"}</span>}</div>
                <div className="p-3"><div className="text-sm font-semibold truncate">{m.name}</div><div className="text-xs text-slate-500">{m.kind} · {fmtSize(m.size)}</div><button className="text-xs font-bold text-red-600 mt-1" onClick={() => removeMedia(m.id)}>Quitar</button></div>
              </div>
            ))}
          </div>
          {!db.media.length && <div className="mt-6"><Empty>Aún no has subido archivos.</Empty></div>}
        </div>
      )}
    </>
  );
}
