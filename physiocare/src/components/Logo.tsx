export function Logo({ dark = true, small }: { dark?: boolean; small?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className={`grid place-items-center bg-amber text-ink font-display font-extrabold leading-none ${small ? "size-8 text-xl" : "size-10 text-2xl"}`}>EF</span>
      <span className={`font-display font-extrabold uppercase leading-[.85] ${small ? "text-base" : "text-xl"} ${dark ? "text-white" : "text-ink"}`}>
        Erik Fitness<span className="block text-amber tracking-[.28em] text-[.6em] mt-0.5">and Rehab</span>
      </span>
    </span>
  );
}
