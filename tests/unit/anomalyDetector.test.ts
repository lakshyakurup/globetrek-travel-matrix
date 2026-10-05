import assert from "node:assert/strict";
import test from "node:test";
import { AnomalyDetector } from "../../src/analytics/anomalyDetector";

test("detects a charge far outside its category distribution", () => {
  const charges = [10, 11, 9, 10, 100].map((amount, index) => ({ id: String(index), travelerId: "t", amount, category: "food", timestamp: new Date().toISOString() }));
  assert.equal(new AnomalyDetector(1.5).detect(charges).length, 1);
});
