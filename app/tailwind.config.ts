import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1D4D3F",
        accent: "#CD9E6A",
        cream: "#FFFFFF",
        "primary-dark": "#14382E",
        "accent-light": "#E8C4A0",
      },
      fontFamily: {
        vazir: ["Vazirmatn", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;