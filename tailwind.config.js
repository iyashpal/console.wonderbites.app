const { fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './resources/**/*.{js,vue,edge}',
  ],

  theme: {

    extend: {

      fontFamily: {
        sans: ['Inter var', ...fontFamily.sans],
      },

    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
