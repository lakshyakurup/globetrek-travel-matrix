"use client";
import { useState } from "react";
import RouteOptimizer from "@/src/components/widgets/RouteOptimizer";

export default function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [stops, setStops] = useState([{ id: "1", name: "Arrival and river walk", latitude: 38.72, longitude: -9.14 }, { id: "2", name: "Sintra day trip", latitude: 38.8, longitude: -9.38 }]);
  void params;
  return <div className="space-y-6"><div><p className="text-sm text-cyan-400">Itinerary editor</p><h2 className="text-3xl font-bold">Collaborative route</h2></div><div className="grid gap-6 lg:grid-cols-2"><section className="rounded-xl border border-slate-800 bg-slate-900 p-5"><h3 className="mb-4 font-semibold">Timeline</h3>{stops.map((stop, index) => <div draggable onDragEnd={() => setStops((items) => items.toReversed())} className="mb-3 cursor-grab rounded-lg border border-slate-700 p-4" key={stop.id}><span className="text-xs text-cyan-300">Day {index + 1}</span><p>{stop.name}</p></div>)}</section><RouteOptimizer stops={stops} /></div></div>;
}
