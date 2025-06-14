/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary:"#05B6D3",
        secondary:"#EF863E"
      },
      backgroundImage:{
         'signup-bg-img':"url('./src/assets/images/4.jpg')",
        'login-bg-img':"url('./src/assets/images/signup.jpg')",
       
      }
    },
  },
  plugins: [],
}