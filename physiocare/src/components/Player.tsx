"use client";
import type { ContentItem } from "@/lib/types";
import { Img } from "./ui";

export function Player({ item }: { item: ContentItem }) {
  if (item.youtubeId) {
    return (
      <div className="aspect-video rounded-2xl overflow-hidden bg-black">
        <iframe className="w-full h-full" src={`https://www.youtube-nocookie.com/embed/${item.youtubeId}`} title={item.title} loading="lazy" allow="accelerometer; encrypted-media; picture-in-picture" allowFullScreen />
      </div>
    );
  }
  return (
    <div className="aspect-video rounded-2xl overflow-hidden relative">
      <Img src={item.image} alt={item.title} />
      <div className="absolute inset-0 bg-ink/55 grid place-items-center text-center p-6">
        <div>
          <div className="size-16 rounded-full bg-amber grid place-items-center mx-auto"><span className="ml-1 border-y-[11px] border-y-transparent border-l-[18px] border-l-ink" /></div>
          <p className="mt-3 text-white font-semibold text-sm">Aquí se reproduce el video de YouTube. Erik lo agrega pegando el enlace en su consola de contenido.</p>
        </div>
      </div>
    </div>
  );
}
