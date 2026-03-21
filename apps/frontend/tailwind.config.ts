import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#0f172a',
        panel: '#111827',
      },
      boxShadow: {
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
