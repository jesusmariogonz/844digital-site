"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

const KEY = "efr-demo-ui";
interface Ctx { show: boolean; set: (v: boolean) => void }
const DemoCtx = createContext<Ctx>({ show: false, set: () => {} });

/** Apagado por defecto: el sitio se ve como el producto terminado del cliente.
 *  Se enciende desde /demo o con ?demo=1 (y se apaga con ?demo=0). */
export function DemoUIProvider({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search).get("demo");
      if (q === "1" || q === "0") localStorage.setItem(KEY, q);
      setShow(localStorage.getItem(KEY) === "1");
    } catch {}
    const onStorage = (e: StorageEvent) => { if (e.key === KEY) setShow(e.newValue === "1"); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  const set = useCallback((v: boolean) => {
    setShow(v);
    try { localStorage.setItem(KEY, v ? "1" : "0"); } catch {}
  }, []);
  return <DemoCtx.Provider value={{ show, set }}>{children}</DemoCtx.Provider>;
}

export const useDemoUI = () => useContext(DemoCtx);

/** Contenido que solo se ve cuando los avisos de demostración están encendidos. */
export function DemoOnly({ children }: { children: React.ReactNode }) {
  return useDemoUI().show ? <>{children}</> : null;
}
