import type { Config } from "tailwindcss"

const config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        'brand-dgreen': '#5F6F52',
        'brand-lgreen': '#A9B388',
        'brand-cream': '#FEFAE0',
        'brand-brown': '#B99470'
      }
    },
  },
  plugins: [],
}

export default config