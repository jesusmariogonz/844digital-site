"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { FlagBadge } from "@/components/ui";

function Login() {
  const sp = useSearchParams();
  const router = useRouter();
  const { db, loginAs, createPatient } = useStore();
  const [tab, setTab] = useState<"demo" | "login" | "crear" | "recuperar">("demo");
  const [f, setF] = useState({ name: "", email: "", phone: "", pass: "" });
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);
  const hiAdmin = sp.get("admin") === "1";

  const enterPatient = (id: string) => { loginAs("patient", id); router.push("/cuenta"); };
  const enterAdmin = () => { loginAs("admin"); router.push("/admin"); };

  return (
    <div className="container-x pt-14 max-w-3xl">
      <h1 className="section-title">Ingresar</h1>
      <p className="text-slate-600 mt-2">Prototipo de demostración: ninguna cuenta es real y no se solicitan credenciales verdaderas.</p>
      <div className="scroll-x flex gap-2 my-6">
        {([["demo", "Accesos de demostración"], ["login", "Iniciar sesión"], ["crear", "Crear cuenta"], ["recuperar", "Recuperar contraseña"]] as const).map(([k, l]) => (
          <button key={k} onClick={() => { setTab(k); setMsg(""); setOk(false); }} className={`btn btn-sm ${tab === k ? "btn-blue" : "btn-outline"}`}>{l}</button>
        ))}
      </div>

      {tab === "demo" && (
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="card p-6 border-2 border-dashed !border-amber">
            <span className="chip bg-amber text-ink">Demo · Experiencia 1</span>
            <h2 className="font-display text-3xl font-extrabold uppercase mt-3">Paciente</h2>
            <p className="text-sm text-slate-600 mt-1">Ana Ramírez (cuenta ficticia). Ve sus citas, pagos y documentos.</p>
            <button className="btn btn-primary mt-4 w-full" onClick={() => enterPatient("p_ana")}>Entrar como paciente demo</button>
          </div>
          <div className={`card p-6 border-2 border-dashed !border-amber ${hiAdmin ? "ring-4 ring-brand/30" : ""}`}>
            <span className="chip bg-amber text-ink">Demo · Experiencia 2</span>
            <h2 className="font-display text-3xl font-extrabold uppercase mt-3">Fisioterapeuta</h2>
            <p className="text-sm text-slate-600 mt-1">Panel de Erik (administrador de demostración): agenda, pacientes, expedientes y consola de contenido.</p>
            <button className="btn btn-blue mt-4 w-full" onClick={enterAdmin}>Entrar como Erik (demo)</button>
          </div>
        </div>
      )}

      {tab === "login" && (
        <form className="card p-6 space-y-3" onSubmit={(e) => {
          e.preventDefault();
          const p = db.patients.find((x) => x.email.toLowerCase() === f.email.toLowerCase());
          if (!p) return setMsg("No encontramos esa cuenta en la demo. Crea una o usa los accesos de demostración.");
          enterPatient(p.id);
        }}>
          <div><label className="label" htmlFor="le">Correo</label><input id="le" type="email" required className="input" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
          <div><label className="label" htmlFor="lp">Contraseña</label><input id="lp" type="password" required className="input" value={f.pass} onChange={(e) => setF({ ...f, pass: e.target.value })} /></div>
          {msg && <p className="text-red-600 text-sm font-semibold">{msg}</p>}
          <p className="text-xs text-slate-500">Demo: cualquier contraseña funciona si el correo existe. En producción: autenticación segura (Supabase Auth u otra).</p>
          <button className="btn btn-primary w-full">Entrar</button> <FlagBadge flag="pendiente" />
        </form>
      )}

      {tab === "crear" && (
        <form className="card p-6 grid sm:grid-cols-2 gap-3" onSubmit={(e) => {
          e.preventDefault();
          if (db.patients.some((x) => x.email.toLowerCase() === f.email.toLowerCase())) return setMsg("Ese correo ya existe en la demo.");
          const p = createPatient({ name: f.name, email: f.email, phone: f.phone });
          enterPatient(p.id);
        }}>
          <div><label className="label" htmlFor="cn">Nombre</label><input id="cn" required className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
          <div><label className="label" htmlFor="ce">Correo</label><input id="ce" type="email" required className="input" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
          <div><label className="label" htmlFor="ct">Teléfono</label><input id="ct" type="tel" required className="input" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></div>
          <div><label className="label" htmlFor="cp">Contraseña</label><input id="cp" type="password" minLength={6} required className="input" value={f.pass} onChange={(e) => setF({ ...f, pass: e.target.value })} /></div>
          {msg && <p className="sm:col-span-2 text-red-600 text-sm font-semibold">{msg}</p>}
          <button className="btn btn-primary sm:col-span-2">Crear cuenta</button>
        </form>
      )}

      {tab === "recuperar" && (
        <form className="card p-6 space-y-3" onSubmit={(e) => { e.preventDefault(); setOk(true); }}>
          <p className="text-sm text-slate-600">Te enviaremos un enlace para restablecer tu contraseña.</p>
          <div><label className="label" htmlFor="re">Correo</label><input id="re" type="email" required className="input" /></div>
          {ok && <p className="rounded-xl bg-emerald-50 text-emerald-800 p-3 text-sm">Simulación: en producción se enviaría un correo con el enlace de recuperación. No se envió nada.</p>}
          <button className="btn btn-primary w-full">Enviar enlace</button> <FlagBadge flag="pendiente" />
        </form>
      )}
    </div>
  );
}

export default function Ingresar() {
  return <Suspense fallback={null}><Login /></Suspense>;
}
