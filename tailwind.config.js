module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      'black': '#18191a',
      'white': '#e4e6eb',
      'grey': {
        100: '#9ba5b4',
        200: '#6f7e93',
        300: '#2b2d2e',
        400: '#242526',
        500: '#49494d',
      },
      'blue': '#1f43f6',
      'blue-light': '#3066ff',
      'red': '#dc3545',
      'green': {
        100: '#12a366',
        200: "#12A36633"
      },
      'yellow': "#FFAC33",
      'transparent': 'transparent'
    },
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    // ...
  ],
}
