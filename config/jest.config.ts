export interface JestConfig {
  testEnvironment: "node" | "jsdom";
  roots: string[];
  extensionsToTreatAsEsm: string[];
  collectCoverageFrom: string[];
}

const config: JestConfig = {
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
};

export default config;
