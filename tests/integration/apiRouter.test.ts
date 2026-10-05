import assert from "node:assert/strict";
import test from "node:test";
import { Router } from "../../src/core/router";

test("routes API requests to the correct service handler", async () => {
  const router = new Router<{ requestId: string }>().on("GET", "/api/trips/:id", ({ requestId }) => ({ requestId }));
  assert.deepEqual(await router.dispatch("GET", "/api/trips/42", { requestId: "req-1" }), { requestId: "req-1" });
});
