"use client";
import { useState } from "react";
export default function AssistantDrawer() {
  const [prompt, setPrompt] = useState(""); const [messages, setMessages] = useState<string[]>(["I’m ready to optimize your next route."]);
  return <aside className="flex w-full max-w-md flex-col rounded-xl border border-slate-800 bg-slate-900 p-4"><h2 className="font-semibold text-cyan-300">Matrix assistant</h2><div className="my-4 min-h-32 flex-1 space-y-2 text-sm text-slate-300">{messages.map((message, index) => <p className="rounded-lg bg-slate-800 p-3" key={`${message}-${index}`}>{message}</p>)}</div><form className="flex gap-2" onSubmit={(event) => { event.preventDefault(); if (!prompt.trim()) return; setMessages((current) => [...current, prompt.trim(), "I’ll compare routes, cost, and travel time for you."]); setPrompt(""); }}><input className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Ask about your trip..." /><button className="rounded-lg bg-cyan-500 px-3 text-slate-950" type="submit">Send</button></form></aside>;
}
