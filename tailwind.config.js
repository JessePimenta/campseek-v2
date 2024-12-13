/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        'surface-hover': 'var(--color-surface-hover)',
        border: 'var(--color-border)',
        text: 'var(--color-text)',
        'text-secondary': 'var(--color-text-secondary)',
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        playing: 'var(--color-playing)',
        visited: 'var(--color-visited)',
      },
      fontFamily: {
        mono: ['monospace', 'ui-monospace', 'SFMono-Regular'],
      },
    },
  },
  plugins: [],
};