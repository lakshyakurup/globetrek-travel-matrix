#!/usr/bin/env node
import { initProject } from "../src/cli/commands/init";
import { runDoctor } from "../src/cli/commands/doctor";
import { generateSeed } from "../src/cli/commands/seed";
import { cliLogger } from "../src/cli/utils/logger";
import { parseArgs } from "../src/cli/utils/parser";

const args = parseArgs(process.argv.slice(2));
try {
  if (args.command === "init") { await initProject(String(args.positionals[0] ?? ".")); cliLogger.success("Travel project initialized"); }
  else if (args.command === "seed") { console.log(JSON.stringify(generateSeed(Number(args.flags.count ?? 3)), null, 2)); }
  else if (args.command === "doctor") { (await runDoctor()).forEach((check) => (check.ok ? cliLogger.success(`${check.name}: ${check.detail}`) : cliLogger.error(`${check.name}: ${check.detail}`))); }
  else { cliLogger.info("Usage: matrix-cli <init|seed|doctor>"); process.exitCode = 1; }
} catch (error) { cliLogger.error(error instanceof Error ? error.message : "Command failed"); process.exitCode = 1; }
