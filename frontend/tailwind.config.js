/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Space Grotesk", "system-ui", "sans-serif"],
        display: ["Anton", "Impact", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      colors: {
        white: "rgb(var(--color-white) / <alpha-value>)",
        brand: {
          cream: "rgb(var(--color-cream) / <alpha-value>)",
          black: "rgb(var(--color-black) / <alpha-value>)",
          green: "rgb(var(--color-green) / <alpha-value>)",
          lightGreen: "rgb(var(--color-lightGreen) / <alpha-value>)",
        },
        surface: {
          900: "#111111",
          800: "#222222",
          100: "#f4f4ec",
        },
      },
      boxShadow: {
        brutal: "4px 4px 0px 0px rgb(var(--color-black))",
        "brutal-sm": "2px 2px 0px 0px rgb(var(--color-black))",
        "brutal-hover": "1px 1px 0px 0px rgb(var(--color-black))",
      },
    },
  },
  plugins: [],
};
