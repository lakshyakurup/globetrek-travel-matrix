export interface BudgetObservation {
  days: number;
  travelers: number;
  destinationIndex: number;
  spend: number;
}

export interface BudgetForecast {
  estimate: number;
  lowerBound: number;
  upperBound: number;
  confidence: number;
}

export class PredictiveBudgetModel {
  private coefficients = [0, 0, 0, 0];
  private means = [0, 0, 0];
  private scales = [1, 1, 1];
  private residualStdDev = 0;
  private trained = false;

  fit(observations: BudgetObservation[]): this {
    if (observations.length < 4) throw new Error("At least four observations are required");
    const means = observations.reduce((totals, item) => [totals[0] + item.days, totals[1] + item.travelers, totals[2] + item.destinationIndex, totals[3] + item.spend], [0, 0, 0, 0]).map((value) => value / observations.length);
    const scales = means.slice(0, 3).map((_, index) => {
      const variance = observations.reduce((sum, item) => sum + (this.features(item)[index] - means[index]) ** 2, 0) / observations.length;
      return Math.sqrt(variance) || 1;
    });
    this.means = means.slice(0, 3);
    this.scales = scales;
    const normalized = observations.map((item) => [1, ...this.features(item).map((value, index) => (value - this.means[index]) / this.scales[index])]);
    const target = observations.map((item) => item.spend);
    this.coefficients = solveLeastSquares(normalized, target);
    const errors = observations.map((item) => item.spend - this.predict(item, means, scales));
    this.residualStdDev = Math.sqrt(errors.reduce((sum, value) => sum + value ** 2, 0) / Math.max(1, errors.length - 4));
    this.trained = true;
    return this;
  }

  forecast(input: Omit<BudgetObservation, "spend">): BudgetForecast {
    if (!this.trained) throw new Error("Model must be fitted before forecasting");
    const estimate = this.predict({ ...input, spend: 0 }, this.means, this.scales);
    const margin = 1.96 * (this.residualStdDev || estimate * 0.1);
    return { estimate: Math.max(0, estimate), lowerBound: Math.max(0, estimate - margin), upperBound: estimate + margin, confidence: Math.max(0, Math.min(1, 1 - margin / Math.max(estimate, 1))) };
  }

  private features(item: BudgetObservation): number[] { return [item.days, item.travelers, item.destinationIndex]; }
  private predict(item: BudgetObservation, means?: number[], scales?: number[]): number {
    const values = this.features(item);
    if (means && scales) return this.coefficients[0] + values.reduce((sum, value, index) => sum + this.coefficients[index + 1] * ((value - means[index]) / scales[index]), 0);
    return this.coefficients[0] + values.reduce((sum, value, index) => sum + this.coefficients[index + 1] * value, 0);
  }
}

function solveLeastSquares(matrix: number[][], target: number[]): number[] {
  const columns = matrix[0].length;
  const normal = Array.from({ length: columns }, (_, row) => Array.from({ length: columns + 1 }, (_, column) => column === columns ? matrix.reduce((sum, values, index) => sum + values[row] * target[index], 0) : matrix.reduce((sum, values) => sum + values[row] * values[column], 0)));
  for (let pivot = 0; pivot < columns; pivot++) {
    const row = normal.slice(pivot).reduce((best, current, index) => Math.abs(current[pivot]) > Math.abs(normal[best][pivot]) ? index + pivot : best, pivot);
    [normal[pivot], normal[row]] = [normal[row], normal[pivot]];
    const divisor = normal[pivot][pivot] || 1;
    normal[pivot] = normal[pivot].map((value) => value / divisor);
    for (let candidate = 0; candidate < columns; candidate++) if (candidate !== pivot) {
      const factor = normal[candidate][pivot];
      normal[candidate] = normal[candidate].map((value, index) => value - factor * normal[pivot][index]);
    }
  }
  return normal.map((row) => row[columns]);
}
