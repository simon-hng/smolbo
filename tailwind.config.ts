import { type Config } from "tailwindcss";
import colors from "tailwindcss/colors";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: colors.slate["900"],
        foreground: "#ffffff",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;
