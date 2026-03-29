"use client";

import { ChangeEvent, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

type Province = {
  id: number;
  name: string;
  region: string;
  latitude: number;
  longitude: number;
  altitude_m: number;
  population: number;
  birth_rate: number;
  death_rate: number;
};

type Risk = {
  risk_name: string;
  causes: string;
  consequences: string;
  affected_population: string;
  hospitals_count: number;
  avg_daily_patients: number | null;
  epidemiological_fallback: string;
  source_name: string;
  source_url: string;
  validation_status: string;
  updated_at: string;
};

type ProvinceDetail = Province & { risks: Risk[] };

type Inference = {
  common_name: string;
  scientific_name: string;
  risk_category: string;
  health_impact: string;
  ecosystem_impact: string;
  reference_image_url: string;
  direct_danger: bool;
  alert_message: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

// Dynamic Leaflet Imports
const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false });
const CircleMarker = dynamic(() => import("react-leaflet").then((m) => m.CircleMarker), { ssr: false });
const Tooltip = dynamic(() => import("react-leaflet").then((m) => m.Tooltip), { ssr: false });

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const { useMap } = require("react-leaflet");
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function Home() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
  const [provinceDetail, setProvinceDetail] = useState<ProvinceDetail | null>(null);
  const [provinceError, setProvinceError] = useState<string | null>(null);
  const [loadingProvince, setLoadingProvince] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<Inference | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const filteredProvinces = provinces.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    async function loadProvinces() {
      try {
        const res = await fetch(`${API_BASE}/regions/provinces`);
        if (!res.ok) throw new Error("No se pudieron cargar las provincias.");
        const data = await res.json();
        setProvinces(data);
      } catch (error) {
        setProvinceError(error instanceof Error ? error.message : "Error cargando provincias.");
      }
    }
    void loadProvinces();
  }, []);

  useEffect(() => {
    if (!selectedProvinceId) return;
    async function loadDetail() {
      setLoadingProvince(true);
      setProvinceError(null);
      try {
        const res = await fetch(`${API_BASE}/regions/provinces/${selectedProvinceId}`);
        if (!res.ok) throw new Error("No se pudo cargar la provincia seleccionada.");
        const data = await res.json();
        setProvinceDetail(data);
      } catch (error) {
        setProvinceError(error instanceof Error ? error.message : "Error cargando detalle.");
      } finally {
        setLoadingProvince(false);
      }
    }
    void loadDetail();
  }, [selectedProvinceId]);

  async function analyzeImage() {
    if (!file) {
      setAnalysisError("Selecciona una imagen antes de analizar.");
      return;
    }
    setLoadingAnalysis(true);
    setAnalysisError(null);
    setAnalysis(null);
    try {
      const body = new FormData();
      body.append("image", file);
      const res = await fetch(`${API_BASE}/intelligence/analyze`, { method: "POST", body });
      if (!res.ok) throw new Error("No fue posible analizar la imagen.");
      const data = await res.json();
      setAnalysis(data);
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : "Error en analisis.");
    } finally {
      setLoadingAnalysis(false);
    }
  }

  const onSelectFile = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] ?? null);
    setAnalysis(null);
    setAnalysisError(null);
  };

  return (
    <main className="relative h-screen w-full overflow-hidden bg-slate-200">
      {/* BACKGROUND HERO MAP */}
      <div className="absolute inset-0 z-0">
        <MapContainer center={[-1.6, -78.7]} zoom={6.8} zoomControl={false} className="h-full w-full">
          <ChangeView 
            center={selectedProvinceId ? [provinces.find(p => p.id === selectedProvinceId)?.latitude ?? -1.6, provinces.find(p => p.id === selectedProvinceId)?.longitude ?? -78.7] : [-1.6, -78.7]} 
            zoom={selectedProvinceId ? 8.5 : 6.8} 
          />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {provinces.map((province) => (
            <CircleMarker
              key={province.id}
              center={[province.latitude, province.longitude]}
              radius={selectedProvinceId === province.id ? 14 : 9}
              pathOptions={{ 
                color: selectedProvinceId === province.id ? "#f43f5e" : "#2563eb",
                fillColor: selectedProvinceId === province.id ? "#f43f5e" : "#3b82f6",
                fillOpacity: 0.6,
                weight: selectedProvinceId === province.id ? 4 : 2
              }}
              eventHandlers={{ click: () => setSelectedProvinceId(province.id) }}
            >
              <Tooltip direction="top" className="rounded-lg shadow-xl border-none">
                <div className="p-2 font-sans">
                  <p className="font-bold text-slate-900 border-b border-slate-100 pb-1 mb-1">{province.name}</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-slate-600">
                    <span>Habitantes:</span>
                    <span className="font-bold text-slate-900">{province.population.toLocaleString("es-EC")}</span>
                    <span>Altitud:</span>
                    <span className="font-medium">{province.altitude_m} m</span>
                  </div>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* TOP HEADER GLOBAL BAR */}
      <header className="absolute top-4 left-1/2 -translate-x-1/2 z-[1100] w-[95%] max-w-4xl">
        <div className="glass flex items-center justify-between rounded-2xl px-6 py-4 shadow-2xl shadow-slate-900/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-xl italic pt-1">R</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none mb-1">Sentinel RBE</h1>
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest leading-none">Epidemiológica Ecuador</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-xs font-bold text-slate-600 bg-white/50 px-4 py-2 rounded-xl hover:bg-white transition-all border border-slate-200 shadow-sm">
              Panel de Administracion
            </Link>
          </div>
        </div>
      </header>

      {/* LEFT FLOATING SIDEBAR (SENTINEL SELECTOR) */}
      <aside className={`absolute top-24 left-6 z-[1200] w-72 transition-all duration-500 transform ${isSidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0 pointer-events-none'}`}>
        <div className="glass rounded-[2rem] overflow-hidden shadow-2xl border border-white/50 flex flex-col max-h-[calc(100vh-140px)]">
          <div className="p-5 border-b border-slate-200/50 bg-white/40">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Provincias
            </h2>
            <div className="relative group">
              <input
                type="text"
                placeholder="Buscar region..."
                className="w-full rounded-2xl border-none bg-white/80 p-3.5 pr-10 text-xs font-medium text-slate-900 shadow-inner focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity">🔍</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {filteredProvinces.length > 0 ? (
              filteredProvinces.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProvinceId(p.id)}
                  className={`group w-full text-left p-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${
                    selectedProvinceId === p.id
                      ? "bg-slate-900 text-white shadow-xl translate-x-1"
                      : "text-slate-600 hover:bg-white hover:shadow-lg hover:text-slate-900"
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="tracking-tight">{p.name}</span>
                    <span className={`text-[9px] font-medium opacity-60 ${selectedProvinceId === p.id ? 'text-blue-200' : 'text-slate-400'}`}>{p.region}</span>
                  </div>
                  {selectedProvinceId === p.id && <span className="animate-in fade-in slide-in-from-left-2 duration-300">→</span>}
                </button>
              ))
            ) : (
              <div className="p-10 text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Sin resultados</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* RIGHT FLOATING DETAILS (EPIDEMIOLOGICAL SENTINEL) */}
      {provinceDetail && !loadingProvince && (
        <section className="absolute top-24 right-6 z-[1200] w-80 max-h-[calc(100vh-140px)] animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="glass rounded-[2rem] p-6 shadow-2xl border border-white/50 flex flex-col h-full overflow-hidden">
            <header className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-full uppercase tracking-widest border border-rose-100 shadow-sm">
                  Reporte Activo
                </span>
                <button onClick={() => setProvinceDetail(null)} className="text-slate-400 hover:text-slate-900 transition-colors">✕</button>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">{provinceDetail.name}</h2>
              <p className="text-xs font-bold text-slate-500">{provinceDetail.region} — {provinceDetail.population.toLocaleString("es-EC")} hab.</p>
            </header>

            <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100/50">
                  <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mb-1">Natalidad</p>
                  <p className="text-lg font-black text-slate-900 leading-none">{provinceDetail.birth_rate}</p>
                </div>
                <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-200/50">
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Altitud</p>
                  <p className="text-lg font-black text-slate-900 leading-none">{provinceDetail.altitude_m}m</p>
                </div>
              </div>

              {provinceDetail.risks.map((risk) => (
                <article key={`${provinceDetail.id}-${risk.risk_name}`} className="bg-white/60 p-5 rounded-3xl border border-white shadow-sm hover:shadow-md transition-all">
                  <div className="w-8 h-8 bg-rose-50 rounded-xl flex items-center justify-center mb-3 shadow-inner">⚠️</div>
                  <h3 className="text-sm font-black text-slate-900 mb-2 leading-tight">{risk.risk_name}</h3>
                  <div className="space-y-3 text-[11px] leading-relaxed">
                    <p className="text-slate-600"><strong className="text-slate-900 uppercase text-[9px] tracking-widest block mb-0.5">Diagnóstico</strong> {risk.causes}</p>
                    <p className="text-slate-600"><strong className="text-slate-900 uppercase text-[9px] tracking-widest block mb-0.5">Impacto</strong> {risk.consequences}</p>
                    
                    <div className="pt-2 flex items-center justify-between border-t border-slate-100 mt-3">
                      <div className="flex flex-col">
                        <span className="text-slate-400 text-[10px]">Pacientes/Día</span>
                        <span className="text-sm font-black text-slate-900">{risk.avg_daily_patients ?? "Fallback"}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-slate-400 text-[10px]">Urgencia</span>
                        <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 rounded-lg">High</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}

              <section className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-900/20">
                <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Inteligencia IA
                </h3>
                <div className="space-y-4">
                  <input type="file" accept="image/*" onChange={onSelectFile} className="block w-full text-[10px] text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 transition-all" />
                  <button
                    onClick={analyzeImage}
                    disabled={loadingAnalysis}
                    className="w-full rounded-2xl bg-blue-600 py-3 text-xs font-black uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/30"
                  >
                    {loadingAnalysis ? "Escaneando..." : "Analizar Patogeno"}
                  </button>
                  
                  {analysis && (
                    <div className="mt-4 pt-4 border-t border-white/10 animate-in fade-in zoom-in duration-500 text-[11px]">
                      <p className="font-black text-blue-400 mb-1 leading-tight">{analysis.common_name} <span className="text-white/40 italic font-medium ml-1">({analysis.scientific_name})</span></p>
                      <p className="text-white/70 leading-relaxed">{analysis.health_impact}</p>
                      <div className="mt-3 p-3 bg-white/5 rounded-2xl border border-white/10 italic text-white/90 text-[10px]">
                        "{analysis.alert_message}"
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </section>
      )}

      {/* FOOTER STATS OVERLAY */}
      <footer className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1100] w-auto">
        <div className="glass px-6 py-2 rounded-full flex items-center gap-6 shadow-xl border border-white/50">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Estado Local:</span>
            <span className="text-[10px] font-black text-slate-900 uppercase">Sincronizado</span>
          </div>
          <div className="w-px h-4 bg-slate-200"></div>
          <div className="text-[9px] text-slate-400 font-medium">© 2026 RBE Sentinel - Bioseguridad Nacional</div>
        </div>
      </footer>
    </main>
  );
}
