/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                'sans': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
                'serif': ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
            },
            animation: {
                'blob': 'blob 7s infinite',
                'spin-slow': 'spin-slow 3s linear infinite',
            },
            keyframes: {
                blob: {
                    '0%, 100%': {
                        transform: 'translate(0, 0) scale(1)',
                    },
                    '33%': {
                        transform: 'translate(30px, -50px) scale(1.1)',
                    },
                    '66%': {
                        transform: 'translate(-20px, 20px) scale(0.9)',
                    },
                },
                'spin-slow': {
                    from: {
                        transform: 'rotate(0deg)',
                    },
                    to: {
                        transform: 'rotate(360deg)',
                    },
                },
            },
        },
    },
    plugins: [],
}
