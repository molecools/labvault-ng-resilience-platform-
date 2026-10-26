import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#102226',
        teal: {
          50: '#effdfa',
          100: '#cffaf3',
          200: '#9bf2e7',
          300: '#5de2d3',
          400: '#25c6bb',
          500: '#10a89f',
          600: '#0b877f',
          700: '#0e6d68',
          800: '#115653',
          900: '#124844',
        },
        coral: '#fb775f',
        sand: '#f7f5ef',
      },
      boxShadow: {
        soft: '0 18px 45px rgba(16, 34, 38, 0.08)',
        glow: '0 0 0 1px rgba(16, 168, 159, 0.12), 0 18px 55px rgba(16, 168, 159, 0.12)',
      },
      fontFamily: {
        sans: ['var(--font-geist)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
