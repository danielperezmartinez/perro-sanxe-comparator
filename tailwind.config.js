/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'linear-bg': '#08090a',
        'linear-panel': '#0f1011',
        'linear-surface': '#191a1b',
        'linear-surface-hover': '#28282c',
        'linear-text': '#f7f8f8',
        'linear-text-secondary': '#d0d6e0',
        'linear-text-tertiary': '#8a8f98',
        'linear-text-muted': '#62666d',
        'linear-brand': '#5e6ad2',
        'linear-brand-hover': '#828fff',
        'linear-success': '#10b981',
        'linear-border': 'rgba(255,255,255,0.08)',
        'linear-border-subtle': 'rgba(255,255,255,0.05)'
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'system-ui', 'sans-serif'],
        mono: ['"Berkeley Mono"', 'ui-monospace', 'monospace']
      }
    },
  },
  plugins: [],
}

