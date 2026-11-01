/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        display: ['"Space Grotesk"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
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
      spacing: {
        4.5: '1.125rem',
        18: '4.5rem',
        22: '5.5rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      transitionDuration: {
        180: '180ms',
        250: '250ms',
        400: '400ms',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      animation: {
        fadeIn: 'fadeIn 420ms cubic-bezier(0.22, 1, 0.36, 1) both',
        fadeUp: 'fadeUp 620ms cubic-bezier(0.22, 1, 0.36, 1) both',
        slideDown: 'slideDown 260ms cubic-bezier(0.22, 1, 0.36, 1) both',
        marquee: 'marquee 38s linear infinite',
        shimmer: 'shimmer 2.4s linear infinite',
        'pulse-soft': 'pulseSoft 3.2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'float-1': 'float1 18s ease-in-out infinite',
        'float-2': 'float2 22s ease-in-out infinite',
        'float-3': 'float3 26s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        shimmer: {
          from: { backgroundPosition: '200% 0' },
          to: { backgroundPosition: '-200% 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.35', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.06)' },
        },
        float1: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(40px, -30px) scale(1.1)' },
        },
        float2: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(-50px, 40px) scale(1.15)' },
        },
        float3: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(30px, 50px) scale(1.08)' },
        },
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.40)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.60)',
        'btn-hover': '0 4px 18px rgba(39, 135, 255, 0.35)',
        'glow-blue': '0 0 25px rgba(39, 135, 255, 0.20)',
        'glow-magenta': '0 0 25px rgba(210, 27, 206, 0.20)',
        'inner-hairline': 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'panel': '0 1px 0 rgba(255, 255, 255, 0.04) inset, 0 24px 48px -24px rgba(0, 0, 0, 0.9)',
      },
    },
  },
  plugins: [],
}
