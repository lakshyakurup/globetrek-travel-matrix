import assert from "node:assert/strict";
import test from "node:test";
import { PredictiveBudgetModel } from "../../src/analytics/predictiveBudget";

test("forecasts a positive budget within a confidence interval", () => {
  const model = new PredictiveBudgetModel().fit([1, 2, 3, 4].map((days) => ({ days, travelers: 2, destinationIndex: 1, spend: days * 100 + 50 })));
  const forecast = model.forecast({ days: 5, travelers: 2, destinationIndex: 1 });
  assert.ok(forecast.estimate > 0);
  assert.ok(forecast.lowerBound <= forecast.estimate && forecast.estimate <= forecast.upperBound);
});
