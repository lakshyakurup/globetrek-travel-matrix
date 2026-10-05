import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const root = process.cwd();
const output = mkdtempSync(join(tmpdir(), "globetrek-tests-"));
const npm = process.platform === "win32" ? "npx.cmd" : "npx";
const testFiles = [
  "tests/matrixMath.test.ts",
  "tests/router.test.ts",
  "tests/unit/anomalyDetector.test.ts",
  "tests/unit/predictiveBudget.test.ts",
  "tests/unit/recommendationEngine.test.ts",
  "tests/integration/apiRouter.test.ts",
  "tests/integration/databasePool.test.ts",
];
const sourceFiles = [
  "src/analytics/anomalyDetector.ts",
  "src/analytics/predictiveBudget.ts",
  "src/analytics/telemetryStream.ts",
  "src/ml/recommendationEngine.ts",
  "src/ml/routeClustering.ts",
  "src/ml/sentimentAnalyzer.ts",
  "src/core/router.ts",
  "src/utils/matrixMath.ts",
];

try {
  execFileSync(npm, [
    "tsc",
    "--target", "ES2020",
    "--module", "commonjs",
    "--moduleResolution", "node",
    "--esModuleInterop",
    "--skipLibCheck",
    "--outDir", output,
    ...testFiles,
    ...sourceFiles,
  ], { cwd: root, stdio: "inherit" });

  execFileSync(process.execPath, [
    "--test",
    ...testFiles.map((file) => join(output, file.replace(/\.tsx?$/, ".js"))),
  ], { cwd: root, stdio: "inherit" });
} finally {
  rmSync(output, { recursive: true, force: true });
}
