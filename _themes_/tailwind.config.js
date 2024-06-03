/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"],
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
        veryDarkBlue: "#031633"
      }
    },
  },
  plugins: [],
}

