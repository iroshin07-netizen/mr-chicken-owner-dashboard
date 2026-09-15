/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        chicken: {
          red: "#D62828",
          gold: "#FFB703",
          cream: "#FFF8F0",
          ink: "#2B2118",
          green: "#60B246",
          danger: "#E23744"
        }
      },
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"]
      },
      boxShadow: {
        soft: "0 12px 36px rgba(43, 33, 24, 0.07)"
      }
    }
  },
  plugins: []
}