/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './resources/**/*.{edge,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        red: {
          primary: '#E1251B',
        },
      },
    },
  },
  plugins: [],
}
