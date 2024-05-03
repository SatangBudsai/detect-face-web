/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");
const ColorThemeLight = require("./src/theme/colors/light");
const ColorThemeDark = require("./src/theme/colors/dark");

module.exports = {
  mode: "jit",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    nextui({
      addCommonColors: true,
      themes: {
        light: ColorThemeLight,
        dark: ColorThemeDark,
      },
    }),
  ],
};
