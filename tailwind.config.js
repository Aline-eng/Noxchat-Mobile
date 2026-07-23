/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        latte: "#F9F3E1",
        ivory: "#FFF2E1",
        champagne: "#F7E7CE",
        charcoal: "#000000",
        ink: "#1B1712",
        inkDim: "#776E5E",
        forest: "#102C26",
        forestDeep: "#013324",
        camel: "#C19A6B",
        donkey: "#A79277",
        noir: "#0C1512",
        noir2: "#142019",
        noir3: "#1C2921",
      },
      fontFamily: {
        display: ["ArchivoBlack_400Regular"],
        serif: ["Literata_400Regular"],
        ui: ["BricolageGrotesque_400Regular"],
      },
    },
  },
  plugins: [],
};
