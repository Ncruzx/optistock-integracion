import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20"></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center mb-16">
          <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-6">
            OptiStock
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Gestión inteligente de activos de red, trazabilidad de equipos y control de inventario técnico en un solo lugar.
          </p>
          <Link href="/login" className="mx-auto">
            <button className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 flex items-center gap-2">
              Iniciar Sesión
              <ArrowRight size={20} />
            </button>
          </Link>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-slate-200 mb-2">Control Total</h3>
            <p className="text-slate-400">Seguimiento por MAC y Serie.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-slate-200 mb-2">Estadísticas</h3>
            <p className="text-slate-400">Reportes de stock en tiempo real.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-slate-200 mb-2">Optimizado</h3>
            <p className="text-slate-400">Diseñado para técnicos de campo.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
