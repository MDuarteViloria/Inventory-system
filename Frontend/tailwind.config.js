export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@medusajs/ui/dist/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2a81a0",
        secondary: "#22718c",
        shadowPrimary: "#767b91",
        lightPrimary: "#c7ccdb",
        whitePrimary: "#e1e5ee",
      },
    },
  },
  presets: [require("./src/Sources/medusaPreset.js")],
  plugins: [],
};
