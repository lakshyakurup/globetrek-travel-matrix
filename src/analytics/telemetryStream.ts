export interface MetricEvent { name: string; value: number; timestamp: number; tags?: Record<string, string>; }
export interface MetricSummary { name: string; count: number; sum: number; average: number; min: number; max: number; lastTimestamp: number; }

export class TelemetryStream {
  private readonly events: MetricEvent[] = [];
  constructor(private readonly maxEvents = 10_000) {}
  record(event: MetricEvent): void { this.events.push(event); if (this.events.length > this.maxEvents) this.events.splice(0, this.events.length - this.maxEvents); }
  snapshot(since = 0): MetricSummary[] {
    const groups = new Map<string, MetricEvent[]>();
    this.events.filter((event) => event.timestamp >= since).forEach((event) => groups.set(event.name, [...(groups.get(event.name) ?? []), event]));
    return [...groups].map(([name, events]) => { const values = events.map((event) => event.value); return { name, count: values.length, sum: values.reduce((sum, value) => sum + value, 0), average: values.reduce((sum, value) => sum + value, 0) / values.length, min: Math.min(...values), max: Math.max(...values), lastTimestamp: Math.max(...events.map((event) => event.timestamp)) }; });
  }
}
