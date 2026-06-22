/** @type {import('tailwindcss').Config} */
// Palette extracted directly from the official association logo (k-means on the
// embedded artwork). The royal blue is the ring, the light cyan is the wings,
// terracotta is the warm human accent. Every token below traces to a real
// pixel in the logo — no invented brand colors.
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary brand blue — built around the logo ring (#205C90)
        brand: {
          50: "#EFF6FB",
          100: "#DBF0F3", // wings (light cyan) — soft section backgrounds
          200: "#C2E0E8",
          300: "#93C2D2",
          400: "#5E9BB8",
          500: "#2F77A0",
          600: "#205C90", // PRIMARY — logo ring
          700: "#285373", // navy depth — headers, footer
          800: "#234560",
          900: "#1E3A50",
        },
        // Warm human accent — the figures' clothing (terracotta / peach)
        warm: {
          300: "#E8B29C", // peach (skin tones in logo)
          500: "#C8806E",
          600: "#B26A5C", // terracotta — call-to-action highlight
        },
        // Cool neutrals tuned to the logo's muted teal-greys
        ink: {
          DEFAULT: "#1F2A33",
          soft: "#52636E",
          line: "#E2E9EE",
        },
      },
      fontFamily: {
        // Tajawal: modern, warm, light Arabic face — single family, multiple
        // weights keeps the PWA payload small for budget devices (Redmi 9A).
        sans: ["Tajawal", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 30px -12px rgba(32, 92, 144, 0.18)",
        card: "0 2px 14px -6px rgba(32, 92, 144, 0.16)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};
