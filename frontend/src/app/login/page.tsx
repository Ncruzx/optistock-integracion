"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (username === "admin" && password === "admin123") {
      localStorage.setItem("optistock_session", "true");
      toast.success("Inicio de sesión exitoso");
      router.push("/dashboard");
    } else {
      toast.error("Usuario o contraseña incorrectos");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10">
      <Toaster position="top-right" />
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-10 shadow-2xl shadow-slate-950/40 backdrop-blur">
        <h1 className="text-4xl font-bold text-slate-100 text-center mb-4">Bienvenido a OptiStock</h1>
        <p className="text-slate-400 text-center mb-8">Ingresa con tus credenciales para acceder al panel de control.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2" htmlFor="username">Usuario</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2" htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
