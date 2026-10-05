import Link from "next/link";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-slate-950 text-slate-100"><aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-800 bg-slate-900 p-6 md:block"><h1 className="mb-8 text-xl font-bold text-cyan-300">Globetrek Matrix</h1><nav className="space-y-2">{[["Overview", "/dashboard"], ["Trips", "/dashboard/trips"], ["Analytics", "/dashboard/analytics"], ["Settings", "/dashboard/settings"]].map(([label, href]) => <Link className="block rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white" href={href} key={href}>{label}</Link>)}</nav></aside><main className="md:ml-64"><header className="flex h-16 items-center justify-between border-b border-slate-800 px-6"><span className="text-sm text-slate-400">Command center</span><span className="flex items-center gap-2 text-sm text-emerald-300"><i className="h-2 w-2 rounded-full bg-emerald-400" />All systems operational</span></header><div className="p-6">{children}</div></main></div>;
}
