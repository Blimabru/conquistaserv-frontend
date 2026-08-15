/* eslint-env node */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,jsx,ts,tsx}'],

  important: true,

  corePlugins: {
    preflight: false,
  },

  theme: {
    extend: {
      colors: {
        primary: 'var(--q-primary)',
        secondary: 'var(--q-secondary)',
        accent: 'var(--q-accent)',
        positive: 'var(--q-positive)',
        negative: 'var(--q-negative)',
        info: 'var(--q-info)',
        warning: 'var(--q-warning)',
        dark: 'var(--q-dark)',
      },
    },
  },

  plugins: [],
};
