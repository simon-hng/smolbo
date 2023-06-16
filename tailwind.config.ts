import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    color: {
      background: "#0f172a",
      foreground: "#ffffff",
    },
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;
