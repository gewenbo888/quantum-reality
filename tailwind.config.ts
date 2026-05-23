import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // the void — cosmic background
        void: {
          950: "#03040a",
          900: "#05060f",
          800: "#080a18",
          700: "#0c0f22",
          600: "#121633",
          500: "#1a1f47",
        },
        // synapse — electric violet (consciousness / thought)
        synapse: {
          700: "#5b3fd6",
          600: "#7551f0",
          500: "#9a6bff",
          400: "#b48dff",
          300: "#cdb2ff",
        },
        // pulse — electric cyan (signal / perception)
        pulse: {
          600: "#1f9fd6",
          500: "#3fc6f5",
          400: "#6fdcff",
          300: "#a6ecff",
        },
        // awaken — warm gold (the universe waking up)
        awaken: {
          600: "#d9a23c",
          500: "#f2c45a",
          400: "#f7d98a",
          300: "#fbe9b8",
        },
        // ether — soft luminous text
        ether: {
          50: "#f4f6ff",
          100: "#e7ebff",
          200: "#cdd3f2",
          400: "#9aa3cf",
          500: "#6a719c",
          600: "#474d72",
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "ui-serif", "Georgia", "serif"],
        body: ['"Space Grotesk"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"Space Mono"', '"JetBrains Mono"', "ui-monospace", "monospace"],
        zh: ['"Noto Serif SC"', "serif"],
        zhsans: ['"Noto Sans SC"', "sans-serif"],
      },
      boxShadow: {
        glass: "inset 0 1px 0 rgba(205,178,255,0.08), 0 24px 70px -30px rgba(0,0,0,0.9)",
        synapse: "0 0 60px -12px rgba(154,107,255,0.55)",
        pulse: "0 0 50px -12px rgba(63,198,245,0.5)",
      },
      keyframes: {
        drift: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        breathe: {
          "0%,100%": { opacity: "0.35", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.04)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        // quantum: a probability amplitude collapsing to a point
        collapse: {
          "0%": { transform: "scale(1)", opacity: "0.5", filter: "blur(6px)" },
          "60%": { transform: "scale(0.12)", opacity: "1", filter: "blur(0px)" },
          "100%": { transform: "scale(0.12)", opacity: "1", filter: "blur(0px)" },
        },
        // quantum: entanglement correlation pulse along a link
        entangle: {
          "0%,100%": { opacity: "0.2" },
          "50%": { opacity: "0.9" },
        },
        // quantum: a wavefunction phase rotating
        phase: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        drift: "drift 9s ease-in-out infinite",
        breathe: "breathe 7s ease-in-out infinite",
        shimmer: "shimmer 8s linear infinite",
        collapse: "collapse 0.9s cubic-bezier(0.4,0,0.2,1) forwards",
        entangle: "entangle 2.6s ease-in-out infinite",
        phase: "phase 12s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
