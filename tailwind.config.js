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
        primary: {
          DEFAULT: 'var(--q-primary)',
          light: 'var(--q-primary-light)',
        },
        secondary: {
          DEFAULT: 'var(--q-secondary)',
          light: 'var(--q-secondary-light)',
        },
        accent: {
          DEFAULT: 'var(--q-accent)',
          light: 'var(--q-accent-light)',
        },
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
