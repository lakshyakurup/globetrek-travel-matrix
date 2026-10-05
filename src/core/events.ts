export type EventListener<T> = (payload: T) => void | Promise<void>;

export class EventBus<Events extends Record<string, unknown>> {
  private readonly listeners = new Map<keyof Events, Set<EventListener<unknown>>>();
  on<K extends keyof Events>(event: K, listener: EventListener<Events[K]>): () => void {
    const set = this.listeners.get(event) ?? new Set<EventListener<unknown>>();
    set.add(listener as EventListener<unknown>);
    this.listeners.set(event, set);
    return () => set.delete(listener as EventListener<unknown>);
  }
  async emit<K extends keyof Events>(event: K, payload: Events[K]): Promise<void> {
    await Promise.all([...this.listeners.get(event) ?? []].map((listener) => listener(payload)));
  }
  clear(event?: keyof Events): void {
    if (event === undefined) this.listeners.clear();
    else this.listeners.delete(event);
  }
}

export type MatrixEvents = { "trip.updated": { tripId: string; version: number }; "traveler.presence": { tripId: string; travelerId: string; online: boolean } };
