"use client";
import { useEffect, useState } from "react";
export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  useEffect(() => { const handler = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setOpen((current) => !current); } }; window.addEventListener("keydown", handler); return () => window.removeEventListener("keydown", handler); }, []);
  if (!open) return <button className="fixed bottom-5 right-5 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300" onClick={() => setOpen(true)} type="button">⌘ K</button>;
  return <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-6 pt-24" onClick={() => setOpen(false)}><div className="w-full max-w-xl rounded-xl border border-slate-700 bg-slate-900 p-4" onClick={(event) => event.stopPropagation()}><input autoFocus className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3" placeholder="Search commands..." /><p className="mt-3 text-xs text-slate-500">Navigate to Trips · Open analytics · Invite collaborator</p></div></div>;
}
