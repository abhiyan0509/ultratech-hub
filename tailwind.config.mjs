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
                    DEFAULT: '#050505',
                    card: '#0a0a0a',
                    depth: '#0f0f0f',
                    border: '#1a1a1a',
                    hover: '#1d1d1f',
                },
                khaki: {
                    DEFAULT: '#b4a076', // Desaturated Metallic Gold
                    muted: '#8e7e5e',
                    light: '#d4c5a9',
                },
                slate: {
                    950: '#020617',
                    900: '#1e1b4b',
                    400: '#a1a1aa',
                    500: '#71717a',
                }
            },
            fontFamily: {
                sans: ['"Inter"', 'system-ui', 'sans-serif'],
                display: ['"Manrope"', '"Inter"', 'sans-serif'],
            },
            fontSize: {
                '2xs': '0.625rem',
                '3xs': '0.5rem',
            },
            letterSpacing: {
                'extra-wide': '0.3em',
                'tighter-executive': '-0.04em',
            },
            boxShadow: {
                'surface-low': '0 1px 2px rgba(0,0,0,0.5)',
                'surface-medium': '0 4px 12px rgba(0,0,0,0.6)',
                'surface-high': '0 12px 32px rgba(0,0,0,0.7)',
                'khaki-glow': '0 0 20px rgba(180, 160, 118, 0.05)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        },
    },
    plugins: [],
}
