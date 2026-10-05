import { readFile } from "node:fs/promises";
import { join } from "node:path";
export async function runMigrations(connection: { exec(sql: string): Promise<void> }, directory = "backend"): Promise<void> { const schema = await readFile(join(directory, "schema.sql"), "utf8"); await connection.exec(schema); }
