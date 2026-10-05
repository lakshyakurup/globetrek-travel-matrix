interface Bucket { tokens: number; updatedAt: number; }
export class TokenBucketRateLimiter {
  private readonly buckets = new Map<string, Bucket>();
  constructor(private readonly capacity = 60, private readonly refillPerSecond = 1) {}
  consume(key: string, cost = 1): boolean {
    const now = Date.now();
    const bucket = this.buckets.get(key) ?? { tokens: this.capacity, updatedAt: now };
    bucket.tokens = Math.min(this.capacity, bucket.tokens + ((now - bucket.updatedAt) / 1000) * this.refillPerSecond);
    bucket.updatedAt = now;
    if (bucket.tokens < cost) { this.buckets.set(key, bucket); return false; }
    bucket.tokens -= cost;
    this.buckets.set(key, bucket);
    return true;
  }
  remaining(key: string): number { return Math.floor(this.buckets.get(key)?.tokens ?? this.capacity); }
}
