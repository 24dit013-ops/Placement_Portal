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
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0284c7', // Primary Sky Blue
          600: '#0369a1',
          700: '#075985',
          800: '#0c4a6e',
          900: '#0a3654',
          950: '#062035',
        },
        slate: {
          850: '#152033',
          950: '#0a0f1d'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.05)',
        'glass-hover': '0 12px 40px 0 rgba(2, 132, 199, 0.12)',
        'glow': '0 0 20px -5px rgba(56, 189, 248, 0.5)',
      }
    },
  },
  plugins: [],
}
