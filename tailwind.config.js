/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        smoIct:'#996600',
      },
      transform: ['responsive', 'hover', 'focus'],
      scale: ['responsive', 'hover', 'focus'],
      transitionProperty: ['responsive', 'hover', 'focus'],
    },
  },
  plugins: [],
}

