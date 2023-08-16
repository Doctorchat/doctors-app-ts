const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        typography: {
          primary: colors.neutral[950],
          secondary: colors.neutral[500],
        },
        "primary": "#06f",
        "primary-hover": "#0058db",
        "gray-600": "#6c757d",
        "danger": "#dc3545",
        "danger-10": "rgba(220, 53, 69, 0.1)",
        "danger-haver": "#CA3433",
        "success": "#198754",
        "success-10": "rgba(25, 135, 84, 0.1)",
        "warring": "#ffa800",
        "warring-10": "rgba(255, 168, 0, 0.1)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        spin: "spin 0.5s linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
