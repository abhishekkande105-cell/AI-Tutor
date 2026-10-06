/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f9',
          100: '#e1e9f2',
          200: '#c3d3e6',
          300: '#95b3d4',
          400: '#608ec0',
          500: '#3d70aa',
          600: '#2b568d',
          700: '#224471',
          800: '#1b385e',
          900: '#18304f',
          950: '#0f1f34',
        },
        academic: {
          slate: '#f8fafc',
          border: '#e2e8f0',
          card: '#ffffff',
          gold: '#f59e0b',
          sage: '#10b981',
          ruby: '#ef4444',
          indigo: '#4f46e5'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        'card': '0 4px 20px -2px rgba(27, 56, 94, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'elevated': '0 10px 30px -5px rgba(27, 56, 94, 0.1), 0 4px 10px -2px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
