/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0f4fa',
                    100: '#e1eaf5',
                    200: '#c5d7eb',
                    300: '#9dbfde',
                    400: '#6fa2cf',
                    500: '#4c87c2',
                    600: '#2A348C', // Azure (Practo Main)
                    700: '#232a70',
                    800: '#1c2157',
                    900: '#161a45',
                    950: '#0e102b',
                },
                accent: {
                    50: '#f0fbfe',
                    100: '#dcf6fd',
                    200: '#beeefb',
                    300: '#91e1f8',
                    400: '#5dcff4',
                    500: '#14BEF0', // Calm (Practo Secondary)
                    600: '#04a0cd',
                    700: '#0480a6',
                    800: '#066885',
                    900: '#0b566f',
                    950: '#07384a',
                },
                trust: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                heading: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
