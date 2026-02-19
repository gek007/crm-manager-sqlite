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
        background: "#0A0A0A",
        foreground: "#FFFFFF",
        card: {
          DEFAULT: "#141414",
          foreground: "#FFFFFF",
        },
        primary: {
          DEFAULT: "#00FF41",
          foreground: "#000000",
          hover: "#00CC33",
        },
        secondary: {
          DEFAULT: "#1C1C1C",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#2A2A2A",
          foreground: "#A0A0A0",
        },
        accent: "#00FF41",
        destructive: "#FF3366",
        border: "#2A2A2A",
        input: "#1C1C1C",
        ring: "#00FF41",
      },
      borderRadius: {
        lg: "8px",
        md: "6px",
        sm: "4px",
      },
    },
  },
  plugins: [],
};

export default config;
