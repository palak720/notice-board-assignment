/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#EDEFEA",
        surface: "#FFFFFF",
        ink: "#1F2A24",
        muted: "#5B6B62",
        border: "#D9DED5",
        brand: {
          DEFAULT: "#2F6F5E",
          dark: "#204C40",
          light: "#DCEAE5",
        },
        urgent: {
          DEFAULT: "#C1442D",
          dark: "#9C3522",
          light: "#FCE3DC",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(31,42,36,0.06), 0 6px 16px rgba(31,42,36,0.06)",
        cardHover: "0 2px 4px rgba(31,42,36,0.08), 0 12px 24px rgba(31,42,36,0.10)",
      },
      borderRadius: {
        card: "10px",
      },
    },
  },
  plugins: [],
};
