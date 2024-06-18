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
      slg: '1280px',
      xl: '1440px',
      xxl: "1920px"
    },
    extend: {
      colors: {
        transparentIndigoBlue: "#05111c",
        darkerTransparentIndigoBlue: "#030C13FF",
        translucentDarkerTransparentIndigoBlue: "rgba(3,12,19,0.82)",
        veryDarkBlue: "#031633",
        spotifyGreen: "#1DB954",
        tuneWeatherCream: "#f1efe7",
        customIndigo: "#2a00ff",
        neonLimeGreen: "#8eff00",
        vibrantMagenta: "#e600ff",
        lightMagenta: "#b700ff",
        darkMagenta: "#a100ff"
      }
    },
  },
  plugins: [],
}

