export interface CacheClient { get<T>(key: string): Promise<T | undefined>; set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>; delete(key: string): Promise<void>; }
interface Entry { value: unknown; expiresAt?: number; }
export class RedisCluster implements CacheClient {
  private readonly store = new Map<string, Entry>();
  constructor(readonly nodes: string[]) { if (!nodes.length) throw new Error("At least one Redis node is required"); }
  async get<T>(key: string): Promise<T | undefined> {
    const entry = this.store.get(key);
    if (!entry || (entry.expiresAt !== undefined && entry.expiresAt <= Date.now())) { this.store.delete(key); return undefined; }
    return entry.value as T;
  }
  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> { this.store.set(key, { value, expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined }); }
  async delete(key: string): Promise<void> { this.store.delete(key); }
}
