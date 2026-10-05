const colors = { reset: "\u001b[0m", cyan: "\u001b[36m", green: "\u001b[32m", yellow: "\u001b[33m", red: "\u001b[31m" };
export const cliLogger = {
  info(message: string): void { console.log(`${colors.cyan}info${colors.reset} ${message}`); },
  success(message: string): void { console.log(`${colors.green}success${colors.reset} ${message}`); },
  warn(message: string): void { console.warn(`${colors.yellow}warn${colors.reset} ${message}`); },
  error(message: string): void { console.error(`${colors.red}error${colors.reset} ${message}`); },
};
