import next from "eslint-config-next";

const enterpriseConfig = [
  ...next,
  { rules: { "no-console": ["warn", { allow: ["warn", "error"] }], "prefer-const": "error", "@typescript-eslint/no-explicit-any": "error" } },
  { ignores: [".next/**", "node_modules/**", "coverage/**"] },
];

export default enterpriseConfig;
