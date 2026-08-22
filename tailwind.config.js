/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta "Videoclub" del Tique de Barrio — ver docs/Decisiones visuales/
        // "Paleta y tipografía del Tique de Barrio".
        'tique-counter': '#3d1f3a',
        'tique-counter-dark': '#2c1729',
        'tique-paper': '#f2e3da',
        'tique-ink': '#2c2417',
        'tique-muted': '#6a5c46',
        'tique-muted-onbrand': '#cbb9c8',
        'tique-border': '#d4b8bd',
        'tique-accent': '#a02f5e',
        'tique-accent-hover': '#7d2247',
        'tique-teal': '#4fd6c0',
        'tique-pill-best': '#2f7d74',
        'tique-pill': '#8a6c80'
      },
      fontFamily: {
        sans: ['"Space Mono"', 'ui-monospace', 'monospace'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
        display: ['"Luckiest Guy"', 'cursive']
      }
    },
  },
  plugins: [],
}
