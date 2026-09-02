/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      colors: {
        brand: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          primary: '#e11d48',
          accent: '#ff1e38',
          dark: '#0B0F17',
          darker: '#06090E',
          card: '#111724',
          gray: {
            50: '#F8FAFC',
            100: '#F1F5F9',
            200: '#E2E8F0',
            300: '#CBD5E1',
            400: '#94A3B8',
            500: '#64748B',
            600: '#475569',
            700: '#334155',
            800: '#1E293B',
            900: '#0F172A',
          }
        },
        cyber: {
          cyan: '#06b6d4',
          blue: '#3b82f6',
          emerald: '#10b981',
          amber: '#f59e0b',
          purple: '#8b5cf6',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace', 'ui-monospace'],
      },
      boxShadow: {
        'luxury': '0 10px 30px -5px rgba(0, 0, 0, 0.06), 0 4px 10px -2px rgba(0, 0, 0, 0.04)',
        'luxury-hover': '0 20px 40px -10px rgba(0, 0, 0, 0.12), 0 8px 16px -4px rgba(225, 29, 72, 0.12)',
        'glow-red': '0 0 25px rgba(225, 29, 72, 0.4)',
        'glow-cyan': '0 0 25px rgba(6, 182, 212, 0.4)',
        'glow-emerald': '0 0 25px rgba(16, 185, 129, 0.4)',
        'glow-subtle': '0 0 15px rgba(225, 29, 72, 0.15)',
        'hud': '0 0 20px rgba(6, 182, 212, 0.25), inset 0 0 15px rgba(6, 182, 212, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'float': 'floatCar 4s ease-in-out infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 2.5s infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'glow-pulse': 'glowPulse 2s infinite ease-in-out',
        'radar-sweep': 'radarSweep 3s linear infinite',
        'hud-scan': 'hudScan 2.5s ease-in-out infinite',
        'equalizer-1': 'equalizer 0.8s ease-in-out infinite alternate',
        'equalizer-2': 'equalizer 0.5s ease-in-out infinite alternate 0.2s',
        'equalizer-3': 'equalizer 0.7s ease-in-out infinite alternate 0.4s',
        'equalizer-4': 'equalizer 0.6s ease-in-out infinite alternate 0.1s',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        floatCar: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-5px) scale(1.008)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(0.98)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(225, 29, 72, 0.2)' },
          '50%': { boxShadow: '0 0 35px rgba(225, 29, 72, 0.55)' },
        },
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        hudScan: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '50%': { opacity: '0.7' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        equalizer: {
          '0%': { height: '15%' },
          '100%': { height: '100%' },
        }
      }
    },
  },
  plugins: [],
}
