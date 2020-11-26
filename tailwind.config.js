const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        primary: ['"Gnuolane Rg"', ...defaultTheme.fontFamily.sans],
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
