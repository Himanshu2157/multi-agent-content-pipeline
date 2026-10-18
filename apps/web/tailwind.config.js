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
          400: '#1685FF', // Bright blue accent
          500: '#0A66C2', // LinkedIn official blue
          600: '#0052a3',
          700: '#004285',
          800: '#00366d',
          900: '#052e5a',
          950: '#031c38',
        },
        forge: {
          50: '#F5F7FA',  // Primary text
          100: '#E8ECF2',
          200: '#D2D8E2',
          300: '#AAB4C5', // Secondary text
          400: '#7F8BA0', // Muted text
          500: '#5A6472',
          600: '#35445A', // Hover border
          700: '#202C3D', // Default border & divider
          800: '#182436', // Elevated component surface
          850: '#151F2E', // Elevated surface
          900: '#111A27', // Card background
          925: '#101622', // Secondary background
          950: '#0B0F17', // Main background
        },
        midnight: {
          bg: '#0B0F17',
          'bg-secondary': '#101622',
          card: '#111A27',
          elevated: '#151F2E',
          text: '#F5F7FA',
          'text-secondary': '#AAB4C5',
          'text-muted': '#7F8BA0',
          border: '#202C3D',
          'border-hover': '#35445A',
          blue: '#0A66C2',
          'blue-bright': '#1685FF',
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
        'btn-hover': '0 4px 14px rgba(10, 102, 194, 0.35)',
      },
    },
  },
  plugins: [],
}
