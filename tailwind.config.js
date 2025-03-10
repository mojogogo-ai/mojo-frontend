/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './packages/portal-pc/index.html',
    './packages/portal-pc/src/**/*.{vue,js,ts,jsx,tsx}',
    './packages/portal-h5/index.html',
    './packages/portal-h5/src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      animation: {
        blink: 'blink 1.2s infinite steps(1, start)'
      },
      keyframes: {
        blink: {
          '0%, 100%': { 'background-color': 'currentColor' },
          '50%': { 'background-color': 'transparent' }
        }
      }
    }
  },
  corePlugins: {
    preflight: false
  },
}
