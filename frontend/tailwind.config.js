/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#09637E',
          DEFAULT: '#088395',
          light: '#7AB2B2',
        },
        accent: '#7AB2B2',
        background: '#EBF4F6',
        teal: {
          900: '#09637E',
          700: '#088395',
          400: '#7AB2B2',
          50: '#EBF4F6',
        },
      },
    },
  },
  plugins: [],
}