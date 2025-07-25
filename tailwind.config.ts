import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "header" : "#383F51",
        "seeders" : "#4eb41c",
        "leechers" : "#d63600"
      },
      objectPosition: {
        'half-top': '70% 30%',
      },
      fontSize: {
        'xxs': '0.625rem', // Smaller than xs (10px)
      },
    },
  },
  plugins: [],
};
export default config;
