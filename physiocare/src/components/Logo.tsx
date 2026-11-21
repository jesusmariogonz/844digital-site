export function Logo({ dark = true, small }: { dark?: boolean; small?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className={`grid place-items-center rounded-xl bg-amber text-ink font-display font-extrabold ${small ? "size-8 text-lg" : "size-10 text-xl"}`}>EF</span>
      <span className={`font-display font-extrabold uppercase leading-[.85] ${small ? "text-base" : "text-xl"} ${dark ? "text-white" : "text-ink"}`}>
        Erik Fitness<span className="block text-brand-2 tracking-[.2em] text-[.62em]">and Rehab</span>
      </span>
    </span>
  );
}
