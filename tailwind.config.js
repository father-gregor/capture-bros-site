const defaultTheme = require('tailwindcss/defaultTheme');
const clientConfig = require('./config/client.json');

module.exports = {
    purge: {
        mode: 'all',
        preserveHtmlElements: false,
        content: [
            './src/client/html/**/*.html',
            './src/client/ts/*.ts',
            './src/client/scss/**/*.scss'
        ]
    },
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
                    'red-light': '#fc1016',
                    blue: '#081527'
                }
            },
            width: {
                '45%':'45%', 
                'client-image-desk': clientConfig.featuredClients.imgWidth,
                'client-image-mobile': Math.round(clientConfig.featuredClients.imgWidth * 0.75)
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
};
