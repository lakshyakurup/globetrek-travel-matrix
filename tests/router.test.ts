import assert from "node:assert/strict";
import test from "node:test";
import { Router } from "../src/core/router";

test("dispatches parameterized and wildcard routes", async () => {
  const router = new Router<{ value: string }>();
  router.on("GET", "/trips/:tripId", ({ value }) => value);
  router.on("GET", "/assets/*", () => "asset");
  assert.equal(await router.dispatch("GET", "/trips/abc", { value: "ok" }), "ok");
  assert.equal(router.match("GET", "/trips/abc")?.params.tripId, "abc");
  assert.equal(await router.dispatch("GET", "/assets/images/map.png", { value: "" }), "asset");
});
