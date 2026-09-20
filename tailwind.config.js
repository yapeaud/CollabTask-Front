/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0D2047",
          "navy-dark": "#0D2047",
          blue: "#167EE0",
          "blue-light": "#D2D8E0",
          "blue-dark": "#167EE0",
          orange: "#E68F20",
          green: "#2FB22F",
        },
      },
    },
  },
  plugins: [],
}

