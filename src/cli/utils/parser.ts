export interface ParsedArgs { command?: string; positionals: string[]; flags: Record<string, string | boolean>; }
export function parseArgs(argv: string[]): ParsedArgs {
  const positionals: string[] = []; const flags: Record<string, string | boolean> = {}; let command: string | undefined;
  for (let index = 0; index < argv.length; index++) { const item = argv[index]; if (item.startsWith("--")) { const [key, inline] = item.slice(2).split("="); flags[key] = inline ?? (argv[index + 1]?.startsWith("-") || !argv[index + 1] ? true : argv[++index]); } else if (!command) command = item; else positionals.push(item); }
  return { command, positionals, flags };
}
