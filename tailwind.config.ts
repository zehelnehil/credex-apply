import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#09090b", // zinc-950
        mist: "#fafafa", // zinc-50
        line: "#e4e4e7", // zinc-200
        credex: {
          50: "#f0fdf4", // emerald-50
          100: "#dcfce7", // emerald-100
          500: "#22c55e", // emerald-500
          700: "#15803d", // emerald-700
          900: "#14532d", // emerald-900
        },
        signal: "#3b82f6",
        amber: "#f59e0b",
        background: "#ffffff",
      },
      boxShadow: {
        soft: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
        focus: "0 0 0 2px rgba(9, 9, 11, 0.2)",
      },
    }
  },
  plugins: []
};

export default config;
