/** @type {import('tailwindcss').Config} */
module.exports = {
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
        accent: {
          50: '#fff8f3',
          100: '#fff0e6',
          500: '#ff7a59'
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
