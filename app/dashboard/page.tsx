import DashboardStats from "@/src/components/widgets/DashboardStats";
import ActiveTravelers from "@/src/components/widgets/ActiveTravelers";

export default function DashboardPage() {
  return <div className="space-y-8"><div><p className="text-sm uppercase tracking-widest text-cyan-400">Travel matrix</p><h2 className="text-3xl font-bold">Good morning, explorer</h2></div><DashboardStats stats={[{ label: "Active trips", value: 4, trend: 12 }, { label: "Shared balance", value: "$1,284", trend: -4 }, { label: "Collaborators", value: 18, trend: 8 }, { label: "Saved hours", value: 32, trend: 18 }]} /><div className="grid gap-6 lg:grid-cols-2"><section className="rounded-xl border border-slate-800 bg-slate-900 p-5"><h3 className="mb-4 text-lg font-semibold">Next departure</h3><p className="text-2xl font-bold">Lisbon · 12 days</p><p className="mt-2 text-slate-400">5 stops · 3 travelers · itinerary synced</p></section><ActiveTravelers travelers={[{ id: "1", name: "You", online: true }, { id: "2", name: "Maya", online: true }, { id: "3", name: "Jon", online: false }]} /></div></div>;
}
