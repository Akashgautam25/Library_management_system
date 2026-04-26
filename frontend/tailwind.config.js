/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090B',
        surface: '#18181B',
        primaryText: '#F4F4F5',
        secondaryText: '#A1A1AA',
        accent: '#3B82F6',
      },
    },
  },
  plugins: [],
}
