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
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                surface: 'var(--surface)',
                border: 'var(--border)',
                muted: 'var(--muted)',
            },
            fontFamily: {
                sans: ['"Inter"', 'system-ui', 'sans-serif'],
                display: ['"Inter"', 'system-ui', 'sans-serif'], // Forcing Inter for ultra-clean look
            },
            fontSize: {
                '3xs': '0.5rem',
            },
            letterSpacing: {
                'tightest': '-0.06em',
                'widest-mono': '0.2em',
            },
            boxShadow: {
                'apple-sm': '0 2px 8px rgba(0,0,0,0.04)',
                'apple-md': '0 8px 24px rgba(0,0,0,0.08)',
                'apple-lg': '0 24px 48px rgba(0,0,0,0.12)',
            },
        },
    },
    plugins: [],
}
