"use client";
export interface MapMarker { id: string; label: string; latitude: number; longitude: number; }
export default function InteractiveMap({ markers }: { markers: MapMarker[] }) {
  return <div className="relative h-80 overflow-hidden rounded-xl border border-slate-800 bg-slate-900" role="img" aria-label="Interactive destination map"><div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)", backgroundSize: "32px 32px" }} />{markers.map((marker) => <span className="absolute rounded-full bg-cyan-400 px-2 py-1 text-xs text-slate-950 shadow-lg" style={{ left: `${((marker.longitude + 180) / 360) * 100}%`, top: `${((90 - marker.latitude) / 180) * 100}%` }} key={marker.id}>{marker.label}</span>)}</div>;
}
