"use client";
import { useEffect, useRef } from "react";
export interface MatrixPoint { id: string; label: string; x: number; y: number; balance: number; }
export default function MatrixCanvas({ points }: { points: MatrixPoint[] }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => { const element = canvas.current; if (!element) return; const context = element.getContext("2d"); if (!context) return; context.clearRect(0, 0, element.width, element.height); context.strokeStyle = "#334155"; context.fillStyle = "#22d3ee"; points.forEach((point, index) => { const next = points[index + 1]; if (next) { context.beginPath(); context.moveTo(point.x, point.y); context.lineTo(next.x, next.y); context.stroke(); } context.beginPath(); context.arc(point.x, point.y, Math.max(5, Math.min(18, Math.abs(point.balance) / 10)), 0, Math.PI * 2); context.fill(); context.fillStyle = "#e2e8f0"; context.fillText(point.label, point.x + 10, point.y + 4); context.fillStyle = "#22d3ee"; }); }, [points]);
  return <canvas ref={canvas} width={720} height={360} className="h-auto max-w-full rounded-xl border border-slate-800 bg-slate-950" aria-label="Travel expense matrix" />;
}
