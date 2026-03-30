"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

type Stats = {
  total_provinces: number;
  total_risks: number;
  inec_last_sync: string;
  msp_last_sync: string;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/stats`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error("Error fetching stats", e);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSync = async (provider: "inec" | "msp" | "inamhi") => {
    setSyncing(provider);
    setMessage(null);
    try {
      const res = await fetch(`${API_BASE}/admin/sync/${provider}`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setMessage({ text: `Sincronizacion ${provider.toUpperCase()} exitosa.`, type: "success" });
        fetchStats();
      } else {
        throw new Error(data.detail || "Error en la sincronizacion");
      }
    } catch (e) {
      setMessage({ text: e instanceof Error ? e.message : "Error desconocido", type: "error" });
    } finally {
      setSyncing(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex items-center justify-between rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Panel de Administracion</h1>
            <p className="text-slate-500 text-sm">Gestion de datos epidemiologicos y fuentes externas.</p>
          </div>
          <Link href="/" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 px-4 py-2 rounded-lg">
            Volver al Mapa
          </Link>
        </header>

        {message && (
          <div className={`p-4 rounded-xl text-sm font-medium border ${
            message.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100"
          } animate-in fade-in slide-in-from-top-2 duration-300`}>
            {message.text}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Sincronizacion de Datos
            </h2>
            <div className="grid gap-3">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all">
                <div>
                  <p className="font-bold text-slate-800">INEC API</p>
                  <p className="text-xs text-slate-500">Poblacion y natalidad</p>
                </div>
                <button
                  onClick={() => handleSync("inec")}
                  disabled={!!syncing}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50 shadow-sm transition-all"
                >
                  {syncing === "inec" ? "Sincronizando..." : "Sincronizar"}
                </button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all">
                <div>
                  <p className="font-bold text-slate-800">MSP Open Data</p>
                  <p className="text-xs text-slate-500">Riesgo epidemiologico</p>
                </div>
                <button
                  onClick={() => handleSync("msp")}
                  disabled={!!syncing}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50 shadow-sm transition-all"
                >
                  {syncing === "msp" ? "Sincronizando..." : "Sincronizar"}
                </button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all">
                <div>
                  <p className="font-bold text-slate-800">INAMHI Analytics</p>
                  <p className="text-xs text-slate-500">Riesgos bioclimaticos</p>
                </div>
                <button
                  onClick={() => handleSync("inamhi")}
                  disabled={!!syncing}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-50 shadow-sm transition-all"
                >
                  {syncing === "inamhi" ? "Escaneando..." : "Sincronizar"}
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Estadisticas del Sistema
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                <p className="text-xs text-amber-700 font-bold uppercase tracking-wider">Provincias</p>
                <p className="text-3xl font-black text-amber-900">{stats?.total_provinces ?? "0"}</p>
              </div>
              <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                <p className="text-xs text-indigo-700 font-bold uppercase tracking-wider">Registros de Riesgo</p>
                <p className="text-3xl font-black text-indigo-900">{stats?.total_risks ?? "0"}</p>
              </div>
            </div>
            <div className="pt-2 text-xs text-slate-400 font-medium">
              Ultima sincronizacion INEC: {stats?.inec_last_sync ?? "Nunca"}
            </div>
          </section>
        </div>

        <section className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-800 tracking-tight">Gestion Manual de Datos</h2>
            <button className="text-xs font-bold text-slate-600 bg-slate-100 px-4 py-2 rounded-lg hover:bg-slate-200 transition-all">
              + Agregar Nueva Provincia
            </button>
          </div>
          <p className="text-center py-12 text-slate-400 italic text-sm">
            Modulo de edicion manual en desarrollo...
          </p>
        </section>
      </div>
    </div>
  );
}
