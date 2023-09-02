const defaultTheme = require("tailwindcss/defaultTheme");

const noMargin = {
  margin: 0,
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      typography: {
        DEFAULT: {
          css: {
            h1: noMargin,
            h2: noMargin,
            h3: noMargin,
            h4: noMargin,
            h5: noMargin,
            h6: noMargin,
            p: noMargin,
            maxWidth: "999999px",
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
