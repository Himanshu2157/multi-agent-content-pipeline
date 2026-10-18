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
          50: '#eef6fc',
          100: '#d9ecf8',
          200: '#b4dbf2',
          300: '#7ec0eb',
          400: '#1685ff',
          500: '#0a66c2', // LinkedIn official blue
          600: '#0052a3',
          700: '#004285',
          800: '#00366d',
          900: '#052e5a',
          950: '#031c38',
        },
        forge: {
          50: '#F5F7FA',  // Primary white text
          100: '#E8ECF2',
          200: '#D2D8E2',
          300: '#A8B0BD', // Muted secondary text
          400: '#7D8795', // Muted tertiary text
          500: '#5A6472',
          600: '#46515F', // Border hover
          700: '#28303A', // Standard border and divider
          800: '#1E2632', // Elevated component surface
          850: '#18202A', // Elevated card surface
          900: '#141A22', // Primary card surface
          925: '#11161D', // Secondary background
          950: '#0D1117', // Main charcoal-black background
        },
        instagram: {
          purple: '#833AB4',
          pink: '#E1306C',
          orange: '#F77737',
        },
      },
      boxShadow: {
        'card': '0 4px 16px rgba(0, 0, 0, 0.22)',
        'card-hover': '0 6px 20px rgba(0, 0, 0, 0.32)',
      },
    },
  },
  plugins: [],
}
