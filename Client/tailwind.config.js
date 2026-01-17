/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Satoshi", "sans-serif"],
        heading: ["Integral CF", "sans-serif"],
      },
      colors: {
        brand: {
          black: "#000000",
          gray: "#F0F0F0",
          light: "#F2F0F1",
          yellow: "#FFC633",
          red: "#FF3333",
        },
      },
      borderRadius: {
        pill: "62px",
        card: "20px",
      },
    },
  },
  plugins: [],
};