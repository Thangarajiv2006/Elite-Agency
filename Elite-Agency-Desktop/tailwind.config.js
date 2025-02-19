/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/renderer/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      primary: 'rgb(71, 182, 245)',
      secondary: 'rgb(39, 207, 171)',
      background: '#121212',
      surface: '#1e1e1e',
      error: '#cf6679',
      onPrimary: '#000000',
      onSecondary: '#000000',
      onBackground: '#dedede',
      onSurface: '#e2e2e2',
      onError: '#000000',
      inputBackground: '#1c1c1c',
      borders: '#2e2e2e',
      inputText: '#e0e0e0',
    },
  },
  plugins: [],
};
