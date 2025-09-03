/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,mjs,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily:{
        sans: [
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'sans-serif',]
      },
      colors: {
        sakura: '#ffe4e1',
        wine: '#722f37',
        charcoal: '#36454f',
      },
      animation: {
        sakuraPulse: 'sakuraGradientShift 20s ease-in-out infinite',
        winePulse: 'wineGradientShift 20s ease-in-out infinite',
      },
      keyframes: {
        sakuraGradientShift: {
          '0%': { backgroundPosition: '50% 75%' },
          '50%': { backgroundPosition: '100% 75%' },
          '100%': { backgroundPosition: '50% 75%' },
        },
        wineGradientShift: {
          '0%': { backgroundPosition: '50% 75%' },
          '50%': { backgroundPosition: '100% 75%' },
          '100%': { backgroundPosition: '50% 75%' },
        },
      },
    },
  },
  plugins: [],
}
