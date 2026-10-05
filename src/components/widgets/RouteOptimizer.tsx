"use client";
import { useMemo } from "react";
export interface Stop { id: string; name: string; latitude: number; longitude: number; }
export default function RouteOptimizer({ stops }: { stops: Stop[] }) {
  const route = useMemo(() => [...stops].sort((a, b) => a.longitude - b.longitude), [stops]);
  return <section><h2>Optimized itinerary</h2><ol>{route.map((stop, index) => <li key={stop.id}><strong>Day {index + 1}:</strong> {stop.name} <small>({stop.latitude.toFixed(2)}, {stop.longitude.toFixed(2)})</small></li>)}</ol></section>;
}
