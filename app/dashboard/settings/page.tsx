"use client";
import { useState } from "react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  return <div className="max-w-2xl space-y-6"><h2 className="text-3xl font-bold">Settings</h2><form className="space-y-5 rounded-xl border border-slate-800 bg-slate-900 p-6" onSubmit={(event) => { event.preventDefault(); setSaved(true); }}><label className="block">Display name<input className="mt-2 block w-full rounded-lg border border-slate-700 bg-slate-950 p-3" defaultValue="Explorer" /></label><label className="block">Notification email<input type="email" className="mt-2 block w-full rounded-lg border border-slate-700 bg-slate-950 p-3" defaultValue="traveler@example.com" /></label><label className="flex items-center gap-3"><input type="checkbox" defaultChecked /> Require a new login on unfamiliar devices</label><button className="rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950" type="submit">Save preferences</button>{saved && <p className="text-emerald-300">Preferences saved.</p>}</form></div>;
}
