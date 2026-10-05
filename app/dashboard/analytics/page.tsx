import DashboardStats from "@/src/components/widgets/DashboardStats";

export default function AnalyticsPage() {
  return <div className="space-y-6"><h2 className="text-3xl font-bold">Analytics</h2><DashboardStats stats={[{ label: "Trip spend", value: "$4,820", trend: 7 }, { label: "Avg. daily cost", value: "$142", trend: -2 }, { label: "Settlements", value: 26 }, { label: "Carbon estimate", value: "0.8t", trend: -11 }]} /><section className="rounded-xl border border-slate-800 bg-slate-900 p-6"><h3 className="mb-6 font-semibold">Expense breakdown</h3><div className="space-y-4">{[["Transport", 68], ["Accommodation", 54], ["Food", 39], ["Activities", 27]].map(([label, value]) => <div key={label}><div className="mb-1 flex justify-between text-sm"><span>{label}</span><span>{value}%</span></div><div className="h-2 rounded-full bg-slate-800"><div className="h-2 rounded-full bg-cyan-400" style={{ width: `${value}%` }} /></div></div>)}</div></section></div>;
}
