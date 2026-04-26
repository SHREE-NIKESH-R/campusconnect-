/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'DM Sans', 'sans-serif'],
      },
      colors: {
        bg: '#f0f0f5',
        accent: { DEFAULT: '#5b6cf8', soft: '#eef0ff', dark: '#3d4fd4', muted: '#8b96f8' },
        violet: { DEFAULT: '#7c5cbf', soft: '#f3eeff' },
        surface: 'rgba(255,255,255,0.75)',
      },
      backdropBlur: { xs: '2px' },
      boxShadow: {
        glass: '0 8px 32px rgba(91,108,248,0.08), 0 2px 8px rgba(0,0,0,0.06)',
        'glass-lg': '0 20px 60px rgba(91,108,248,0.12), 0 4px 16px rgba(0,0,0,0.08)',
        neu: '6px 6px 16px rgba(180,180,200,0.4), -4px -4px 12px rgba(255,255,255,0.8)',
      }
    },
  },
  plugins: [],
}
