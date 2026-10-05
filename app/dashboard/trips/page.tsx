"use client";
import Link from "next/link";
import { useMemo, useState } from "react";

const trips = [{ id: "lisbon", title: "Atlantic loop", destination: "Lisbon, Portugal", status: "Planning", days: 8 }, { id: "kyoto", title: "Autumn in Kansai", destination: "Kyoto, Japan", status: "Confirmed", days: 12 }, { id: "patagonia", title: "Southern crossing", destination: "Patagonia, Chile", status: "Draft", days: 6 }];

export default function TripsPage() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => trips.filter((trip) => `${trip.title} ${trip.destination}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return <div className="space-y-6"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-cyan-400">Workspace</p><h2 className="text-3xl font-bold">Travel matrix</h2></div><input className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2" placeholder="Search trips..." value={query} onChange={(event) => setQuery(event.target.value)} /></div><div className="grid gap-4 md:grid-cols-3">{filtered.map((trip) => <Link href={`/dashboard/trips/${trip.id}`} className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:border-cyan-500" key={trip.id}><span className="text-xs text-cyan-300">{trip.status}</span><h3 className="mt-3 text-lg font-semibold">{trip.title}</h3><p className="text-slate-400">{trip.destination}</p><p className="mt-6 text-sm text-slate-500">{trip.days} days · synced</p></Link>)}</div></div>;
}
