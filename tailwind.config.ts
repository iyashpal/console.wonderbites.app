import type { Config } from 'tailwindcss'
import {fontFamily} from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './resources/**/*.{edge,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...fontFamily.sans],
      },
      colors: {
        red: {
          primary: '#E1251B',
        },
      },

      maxHeight: {
        content: 'calc(100vh - 90px)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} satisfies Config
