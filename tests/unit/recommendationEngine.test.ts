import assert from "node:assert/strict";
import test from "node:test";
import { recommendDestinations } from "../../src/ml/recommendationEngine";

test("ranks the closest destination vector first", () => {
  const result = recommendDestinations([1, 0], [{ id: "near", name: "Near", features: [1, 0], tags: [] }, { id: "far", name: "Far", features: [0, 1], tags: [] }]);
  assert.equal(result[0].id, "near");
});
