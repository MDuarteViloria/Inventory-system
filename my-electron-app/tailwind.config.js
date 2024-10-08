/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2d4f8e",
        secondary: "#2f4467",
        shadowPrimary: "#767b91",
        lightPrimary: "#c7ccdb",
        whitePrimary: "#e1e5ee",
      },
    },
  },
  plugins: [],
};
