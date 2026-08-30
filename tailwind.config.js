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
        dark: {
          950: '#000000',
          900: '#08080A',
          850: '#121216',
          800: '#1C1C22',
          700: '#27272F',
        },
        cyber: {
          titanium: '#E2E8F0',
          platinum: '#F8FAFC',
          silver: '#94A3B8',
          emerald: '#10B981',
          gold: '#F59E0B',
          purple: '#A855F7'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Space Grotesk', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'liquid': '0 20px 50px rgba(0, 0, 0, 0.95), inset 0 1px 2px 0 rgba(255, 255, 255, 0.35), inset 0 -2px 4px 0 rgba(0, 0, 0, 0.8)',
        'liquid-glow': '0 0 35px rgba(255, 255, 255, 0.15), inset 0 1px 2px 0 rgba(255, 255, 255, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-reverse': 'float-reverse 10s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-15px) scale(1.03)' },
        },
        'float-reverse': {
          '0%, 100%': { transform: 'translateY(0px) scale(1.03)' },
          '50%': { transform: 'translateY(15px) scale(1)' },
        }
      }
    },
  },
  plugins: [],
}
