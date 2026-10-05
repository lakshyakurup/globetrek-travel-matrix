import assert from "node:assert/strict";
import test from "node:test";

class TestPool {
  private active = 0;
  private waiters: (() => void)[] = [];
  constructor(private readonly capacity: number) {}
  async query<T>(work: () => Promise<T>): Promise<T> {
    if (this.active >= this.capacity) await new Promise<void>((resolve) => this.waiters.push(resolve));
    this.active++;
    try { return await work(); } finally { this.active--; this.waiters.shift()?.(); }
  }
}

test("pool releases connections after concurrent work", async () => {
  const pool = new TestPool(10);
  const values = await Promise.all(Array.from({ length: 50 }, (_, index) => pool.query(async () => index)));
  assert.equal(values.length, 50);
});
