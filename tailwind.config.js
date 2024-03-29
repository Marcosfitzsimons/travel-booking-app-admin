/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        "input-bg": "hsl(var(--input-bg))",
        "income-accent": "hsl(var(--income-accent))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        hover: {
          DEFAULT: "hsl(var(--hover))"
        },
        "pink-1": {
          '50': '#fef6f6',
          '100': '#fdecec',
          '200': '#fbd0d0',
          '300': '#f9b4b4',
          '400': '#f47c7c',
          '500': '#ef4444',
          '600': '#d73d3d',
          '700': '#b33333',
          '800': '#8f2929',
          '900': '#752121'
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      boxShadow: {
        input: "0px 1px 0px -1px var(--tw-shadow-color), " +
          "0px 1px 1px -1px var(--tw-shadow-color), " +
          "0px 1px 2px -1px var(--tw-shadow-color), " +
          "0px 2px 4px -2px var(--tw-shadow-color), " +
          "0px 3px 6px -3px var(--tw-shadow-color)",
        highlight: "inset 0px 0px 0px 1px var(--tw-shadow-color), " +
          "inset 0px 1px 0px var(--tw-shadow-color)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}