/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "zoom-pulse": {
          "0%, 100%": { transform: "scale(0.8)" },
          "50%": { transform: "scale(1.1)" },
        },
      },
      animation: {
        "zoom-pulse": "zoom-pulse 1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
