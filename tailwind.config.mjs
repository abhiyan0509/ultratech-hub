/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                obsidian: {
                    DEFAULT: '#09090b',
                    card: '#111114',
                    border: '#1f1f23',
                    hover: '#27272a',
                },
                gold: {
                    DEFAULT: '#d4af37',
                    muted: '#b8922e',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Manrope', 'sans-serif'],
            },
            animation: {
                'shimmer': 'shimmer 2s infinite linear',
                'v7-pulse': 'v7-pulse 2s infinite ease-in-out',
            },
            keyframes: {
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
                'v7-pulse': {
                    '0%, 100%': { opacity: 0.3 },
                    '50%': { opacity: 0.6 },
                }
            }
        },
    },
    plugins: [],
}
