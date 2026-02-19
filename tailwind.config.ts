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
        background: "#FFFFFF",
        foreground: "#1A1A1A",
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1A1A1A",
        },
        primary: {
          DEFAULT: "#000000",
          foreground: "#FFFFFF",
          hover: "#333333",
        },
        secondary: {
          DEFAULT: "#F5F5F7",
          foreground: "#1A1A1A",
        },
        muted: {
          DEFAULT: "#F5F5F7",
          foreground: "#6E6E73",
        },
        accent: "#F5F5F7",
        destructive: "#FF3B30",
        border: "#E5E5E7",
        input: "#E5E5E7",
        ring: "#000000",
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "6px",
      },
      boxShadow: {
        "modern": "0 1px 2px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.02)",
        "modern-hover": "0 2px 4px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
