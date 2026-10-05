import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
export async function initProject(directory: string): Promise<void> { await mkdir(join(directory, "trips"), { recursive: true }); await writeFile(join(directory, "trips", "matrix.json"), JSON.stringify({ version: 1, trips: [] }, null, 2)); await writeFile(join(directory, ".env.example"), "API_BASE_URL=http://localhost:8000\n"); }
