/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { matrix: { 50: "#ecfeff", 400: "#22d3ee", 500: "#06b6d4", 700: "#0e7490", 950: "#082f49" } },
      fontFamily: { display: ["var(--font-geist-sans)", "ui-sans-serif"], mono: ["var(--font-geist-mono)", "ui-monospace"] },
    },
  },
  plugins: [],
};
