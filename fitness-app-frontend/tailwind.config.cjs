/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f7ff',
          100: '#eceffb',
          500: '#646cff',
          700: '#535bf2'
        },
        secondary: {
          50: '#f3fbff',
          100: '#e6f6ff',
          500: '#06b6d4',
          700: '#0891b2'
        },
        accent: {
          50: '#fff8f3',
          100: '#fff0e6',
          500: '#ff7a59'
        },
        success: {
          500: '#22c55e'
        },
        warning: {
          500: '#f59e0b'
        },
        neutral: {
          50: '#f7f7fb',
          100: '#efefef',
          800: '#1f2937'
        }
      },
      container: {
        center: true,
        padding: '1rem'
      }
    }
  },
  plugins: []
}
