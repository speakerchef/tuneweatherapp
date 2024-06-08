/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens : {
      sm: '480px',
      md: '768px',
      lg: '1024px',
      xl: '1440px'
    },
    extend: {
      colors: {
        transparentIndigoBlue: "#05111c",
        darkerTransparentIndigoBlue: "#030c13",
        veryDarkBlue: "#031633",
        spotifyGreen: "#1DB954",
        tuneWeatherCream: "#f1efe7"
      }
    },
  },
  plugins: [],
}

