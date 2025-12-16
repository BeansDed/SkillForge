import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#6366F1', dark: '#4F46E5' },
        success: { DEFAULT: '#84CC16', dark: '#65A30D' },
        danger: { DEFAULT: '#EF4444', dark: '#B91C1C' },
        background: '#0F172A',
        surface: '#1E293B',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'neo': '0 4px 0 0 rgba(0, 0, 0, 0.25)',
        'neo-lg': '0 6px 0 0 rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
};

export default config;
