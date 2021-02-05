const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    purge: [],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            fontFamily: {
                'capture-bros': ['Mastodon'],
                logo: ['"Gnuolane Rg"', ...defaultTheme.fontFamily.sans],
                heading: ['"Montserrat Black"'],
                text: ['Lato']
            },
            colors: {
                capture: {
                    red: '#d20d12',
                    blue: '#081527'
                }
            }
        },
        backgroundColor: (theme) => ({
            ...theme('colors'),
            'background': '#DEE2E5'
        })
    },
    variants: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/forms')
    ],
}
