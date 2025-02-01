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
        borderWidth: {
          min: "4px",
          sm: "8px",
          med: "12px",
          lg: "16px",
          xlg: "20px",
          max: "24px",
        },
        colors: {
          background: "var(--background)",
          foreground: "var(--foreground)",
        },
        fontFamily: {
          Cinzel: "var(--ff-cinzel)",
          Montserrat: "var(--ff-montserrat)",
          Red_Hat_Display: "var(--ff-redHat)",
        },
        height: {
          min: "24px",
          sm: "36px",
          med: "56px",
          lg: "64px",
          xlg: "72px",
          max: "80px",
        },
        margin: {
          min: "8px",
          sm: "16px",
          med: "24px",
          lg: "32px",
          max: "40px",
        },
        padding: {
          min: "4px",
          sm: "8px",
          med: "12px",
          lg: "24px",
          xlg: "40px",
          max: "64px",
        },
        fontSize: {
          min: "16px",
          sm: "24px",
          med: "36px",
          lg: "50px",
          xlg: "60px",
          max: "70px",
        },
        gap: {
          min: "20px",
          med: "30px",
          max: "60px",
        },
        letterSpacing: {
          min: "1.2px",
          sm: "2.4px",
          med: "4.8px",
        }
      },
    },
    plugins: [],
};