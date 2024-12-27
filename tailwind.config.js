// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Includes all JS, JSX, TS, and TSX files in your project
    "./src/App.css", // Ensures Tailwind processes your custom CSS
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
