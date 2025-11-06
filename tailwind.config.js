const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  plugins: [
    require('tailwindcss-animate'),
    function ({ addVariant }) {
      addVariant('child', '& > *');
      addVariant('child-hover', '& > *:hover');
    },
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.no-scrollbar::-webkit-scrollbar': {
          display: 'none',
        },
        '.no-scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
        '.small-scrollbar': {
          'scrollbar-width': '4px',
          'scrollbar-color': 'var(--muted) transparent',
          '-ms-overflow-style': 'none',
        },
        '.small-scrollbar::-webkit-scrollbar': {
          width: '4px',
          'background-color': 'transparent',
        },
        '.small-scrollbar::-webkit-scrollbar-thumb': {
          background: 'var(--muted)',
          'border-radius': '3px',
          'z-index': '20',
        },
        '.small-scrollbar::-webkit-scrollbar-track': {
          'background-clip': 'content-box',
          'margin-bottom': '10px',
          'margin-top': '10px',
        },
      });
    }),
  ],
};
