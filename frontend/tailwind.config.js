/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'hebrew': ['Heebo', 'Arial', 'sans-serif'],
      },
      colors: {
        'familia-blue': '#1e3a8a',
        'familia-gold': '#f59e0b',
        'familia-warm': '#fef3c7',
      }
    },
  },
  plugins: [],
}