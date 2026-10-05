import assert from "node:assert/strict";
import test from "node:test";
import { simplifyDebts } from "../src/utils/matrixMath";

test("simplifies a shared expense into the minimum settlement", () => {
  assert.deepEqual(simplifyDebts([
    { paidBy: "A", amount: 90, participants: ["A", "B", "C"] },
  ]), [{ from: "B", to: "A", amount: 30 }, { from: "C", to: "A", amount: 30 }]);
});

test("supports multiple payers", () => {
  assert.deepEqual(simplifyDebts([
    { paidBy: "A", amount: 100, participants: ["A", "B"] },
    { paidBy: "B", amount: 40, participants: ["A", "B"] },
  ]), [{ from: "B", to: "A", amount: 30 }]);
});
