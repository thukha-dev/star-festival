import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        night: {
          900: "#050818",
          800: "#0a1030",
          700: "#121d4d"
        }
      },
      boxShadow: {
        glow: "0 0 24px rgba(130, 196, 255, 0.4)"
      },
      animation: {
        twinkle: "twinkle 4s ease-in-out infinite",
        sway: "sway 6s ease-in-out infinite"
      },
      keyframes: {
        twinkle: {
          "0%, 100%": { opacity: "0.25" },
          "50%": { opacity: "0.8" }
        },
        sway: {
          "0%, 100%": { transform: "rotate(-0.7deg)" },
          "50%": { transform: "rotate(0.7deg)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
