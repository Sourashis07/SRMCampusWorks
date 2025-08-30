/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0a0e1a',
        'dark-card': '#1a1f2e',
        'dark-nav': '#141827',
      }
    },
  },
  plugins: [],
}