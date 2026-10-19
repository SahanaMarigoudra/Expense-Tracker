// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "hsl(250, 80%, 60%)",
        secondary: "hsl(210, 15%, 20%)",
        accent: "hsl(340, 80%, 60%)",
        background: "hsl(0, 0%, 100%)",
        foreground: "hsl(220, 13%, 20%)",
        "bg-dark": "hsl(220, 13%, 12%)",
        "text-dark": "hsl(220, 13%, 90%)"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"]
      }
    }
  },
  plugins: [],
  darkMode: "class"
};
