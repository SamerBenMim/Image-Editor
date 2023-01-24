/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      maxHeight: {
        120: "30rem",
      },
      colors: {
        buttonBlue: "#0375ff",
        primaryBackground: "#121212",
        secondaryBackground: "#2c2c2c",
      },
    },
  },
  plugins: [],
};
