// tailwind.config.js
const {nextui} = require("@nextui-org/theme");
const { Montserrat } = require("next/font/google");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/@nextui-org/theme/dist/components/(dropdown|menu|divider|popover|button|ripple|spinner).js",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        colors: {
          background: "var(--background)",
          foreground: "var(--foreground)",
        },
        fontFamily: {
          Cinzel: "var(--ff-cinzel)",
          Montserrat: "var(--ff-montserrat)",
          Red_Hat_Display: "var(--ff-redHat)",
        },
      },
    },
    plugins: [],
};