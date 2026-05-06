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
        brand: {
          cream: "#f4f4ec",
          black: "#111111",
          green: "#2e5b32",
          lightGreen: "#8ab88e",
        },
        surface: {
          900: "#111111",
          800: "#222222",
          100: "#f4f4ec",
        },
      },
      boxShadow: {
        brutal: "6px 6px 0px 0px rgba(17,17,17,1)",
        "brutal-sm": "4px 4px 0px 0px rgba(17,17,17,1)",
        "brutal-hover": "2px 2px 0px 0px rgba(17,17,17,1)",
      },
    },
  },
  plugins: [],
};
