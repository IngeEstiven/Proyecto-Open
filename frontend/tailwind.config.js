/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#bb86fc',
        accent: '#03dac6'
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'cursive'],
        sans: ['"Rajdhani"', 'sans-serif']
      }
    }
  },
  plugins: []
};
