/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Official ContentSmith Design System Palette */
        brand: {
          50: '#eef6fc',
          100: '#d9ecf8',
          200: '#b4dbf2',
          300: '#7ec0eb',
          400: '#2787FF', // Electric Blue (Primary Accent)
          500: '#1E74E0',
          600: '#0052a3',
          700: '#004285',
          800: '#00366d',
          900: '#052e5a',
          950: '#000000',
        },
        forge: {
          50: '#E8EDF7',  // Primary text: Off-White
          100: '#DEE4F0',
          200: '#C7D0E0',
          300: '#A1A9BA', // Secondary text: Muted Cool Gray
          400: '#737D91', // Muted text
          500: '#525B6C',
          600: '#34445F', // Hover border: Blue-Tinted Slate
          700: '#252B38', // Subtle border: Dark Slate
          800: '#111827', // Elevated surface
          850: '#0E1422', // Sub-surface
          900: '#080C15', // Cards & Surfaces: Near-Black Navy
          925: '#04070D', // Deep Navy Tint
          950: '#000000', // Main Background: Pure Black
        },
        midnight: {
          bg: '#000000',
          'bg-secondary': '#04070D',
          card: '#080C15',
          elevated: '#0E1422',
          text: '#E8EDF7',
          'text-secondary': '#A1A9BA',
          'text-muted': '#737D91',
          border: '#252B38',
          'border-hover': '#34445F',
          blue: '#2787FF',
          magenta: '#D21BCE',
        },
        accent: {
          blue: '#2787FF',     // Electric Blue (Primary)
          magenta: '#D21BCE',  // Magenta (Secondary)
        },
        instagram: {
          purple: '#833AB4',
          pink: '#D21BCE',
          orange: '#F77737',
        },
        /* Shadcn Core Tokens mapped to Official Pure Black / Near-Black Navy Palette */
        background: '#000000',
        foreground: '#E8EDF7',
        border: '#252B38',
        ring: '#2787FF',
        muted: {
          DEFAULT: '#080C15',
          foreground: '#A1A9BA',
        },
        card: {
          DEFAULT: '#080C15',
          foreground: '#E8EDF7',
        },
        popover: {
          DEFAULT: '#080C15',
          foreground: '#E8EDF7',
        },
        primary: {
          DEFAULT: '#2787FF',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#D21BCE',
          foreground: '#FFFFFF',
        },
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.40)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.60)',
        'btn-hover': '0 4px 18px rgba(39, 135, 255, 0.35)',
        'glow-blue': '0 0 25px rgba(39, 135, 255, 0.20)',
        'glow-magenta': '0 0 25px rgba(210, 27, 206, 0.20)',
      },
    },
  },
  plugins: [],
}
