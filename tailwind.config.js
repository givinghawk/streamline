/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e3f2fd',
          100: '#bbdefb',
          200: '#90caf9',
          300: '#64b5f6',
          400: '#42a5f5',
          500: '#2196f3',
          600: '#1e88e5',
          700: '#1976d2',
          800: '#1565c0',
          900: '#0d47a1',
        },
        surface: {
          DEFAULT: '#121212',
          elevated: '#1e1e1e',
          elevated2: '#2a2a2a',
          elevated3: '#363636',
        },
        'light-surface': {
          DEFAULT: '#f5f5f5',
          elevated: '#ffffff',
          elevated2: '#fafafa',
          elevated3: '#f0f0f0',
        },
      },
      boxShadow: {
        'material': '0 2px 4px rgba(0,0,0,0.2), 0 1px 10px rgba(0,0,0,0.12), 0 4px 5px rgba(0,0,0,0.14)',
        'material-lg': '0 8px 10px rgba(0,0,0,0.2), 0 6px 30px rgba(0,0,0,0.12), 0 16px 24px rgba(0,0,0,0.14)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
