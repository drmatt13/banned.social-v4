/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        "cart-bounce": "cart-bounce 7s linear infinite",
        "fade-in-slow": "fade-in .5s ease-in forwards",
        "fade-in": "fade-in .25s ease-in forwards",
        "fade-in-fast": "fade-in .1s ease-in forwards",
        "spin-slow": "spin 5s linear infinite",
        "wiggle-slow": "wiggle 2s linear infinite",
        wiggle: "wiggle 1s linear infinite",
        "wiggle-fast": "wiggle .5s linear infinite",
      },
      colors: {
        "light-primary": "var(--color-light-primary)",
        "light-secondary": "var(--color-light-secondary)",
        "light-accent": "var(--color-light-accent)",
        "light-form": "var(--color-light-form)",
        "light-border": "var(--color-light-border)",

        "dark-primary": "var(--color-dark-primary)",
        "dark-secondary": "var(--color-dark-secondary)",
        "dark-accent": "var(--color-dark-accent)",
        "dark-form": "var(--color-dark-form)",
        "dark-border": "var(--color-dark-border)",
      },
      keyframes: {
        "cart-bounce": {
          "0%, 90%, 95%, 100%": { transform: "translate(0.5rem, -0.375rem)" },
          "92.5%, 97.5%": { transform: "translate(0.5rem, -0.65625rem)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
    },
    screens: {
      "2xs": "375px",
      xs: "400px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
  },
  plugins: [],
};
