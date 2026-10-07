var config = {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            colors: {
        orange: {
          50: '#fff3f0',
          100: '#ffe3dc',
          200: '#ffc7b9',
          300: '#ff9d86',
          400: '#f0654a',
          500: '#e42b0c',
          600: '#e42b0c',
          700: '#b8200a',
          800: '#8f1a0a',
          900: '#6b1409',
        },
        carbon: '#1f1f1f',
        vellum: '#f5f5f5',
                surface: '#0f172a',
                panel: '#111827',
            },
            fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)',
        lift: '0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.06)',
                glow: '0 0 0 1px rgba(6, 182, 212, 0.2), 0 10px 30px rgba(2, 132, 199, 0.12)',
            },
            keyframes: {
                reveal: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
            animation: {
                reveal: 'reveal 0.45s ease-out both',
            },
        },
    },
    plugins: [],
};
export default config;
