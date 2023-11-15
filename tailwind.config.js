/** @type {import('tailwindcss').Config} */
import scrollbarPlugin from "tailwind-scrollbar";
import daisyui from "daisyui"

export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        screen: ["100vh", "100dvh"],
        
      },
      minHeight: {
        screen: ["100vh", "100dvh"],
      },
      maxHeight: {
        screen: ["100vh", "100dvh"],
      }
    },
  },
  plugins: [
    scrollbarPlugin,
    daisyui
  ],
}
