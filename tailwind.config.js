/** @type {import('tailwindcss').Config} */
const baseConfig = require("tailwindcss/defaultConfig")
const baseFontSize = baseConfig.theme.fontSize

module.exports = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        md: "2rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        secondary: {
          DEFAULT: "#00adb5",
          light: "#3ec0c7",
          dark: "#008a91",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: "#fccd11",
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "var(--card-bg)",
          foreground: "hsl(var(--card-foreground))",
        },
        navy: {
          DEFAULT: "#28384d",
          light: "#3a4d68",
        },
        turquoise: "#00adb5",
        yellow: "#fccd11",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-montserrat)"],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-diagonal': 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'card': '0 4px 12px var(--shadow-color)',
        'card-hover': '0 8px 16px var(--shadow-color-strong)',
        'dark': '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
        'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
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
        "scroll": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
        "infinite-scroll": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "float": {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
          "100%": { transform: "translateY(0px)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        "slide-down": {
          "0%": { transform: "translateY(-100%)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.7 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "scroll": "scroll 30s linear infinite",
        "infinite-scroll": "infinite-scroll 30s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "slide-up": "slide-up 0.5s ease-out",
        "slide-down": "slide-down 0.5s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
      },
      screens: {
        xs: "475px",
      },
      transitionDuration: {
        '2000': '2000ms',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("tailwind-scrollbar-hide"),
    ({ addUtilities, addVariant, addComponents }) => {
      addVariant("hover-pause", "&:hover")
      addVariant("group-hover", ".group:hover &")
      addVariant("peer-hover", ".peer:hover ~ &")
      addVariant("supports-backdrop", "@supports (backdrop-filter: blur(0px))")
      addVariant("supports-scrollbar", "@supports selector(::-webkit-scrollbar)")
      addVariant("children", "& > *")
      addVariant("scrollbar", "&::-webkit-scrollbar")
      addVariant("scrollbar-track", "&::-webkit-scrollbar-track")
      addVariant("scrollbar-thumb", "&::-webkit-scrollbar-thumb")
      addVariant("optional", "&:optional")
      addVariant("before-hover", "&:hover::before")
      addVariant("after-hover", "&:hover::after")
      addVariant("first-of-type", "&:first-of-type")
      addVariant("last-of-type", "&:last-of-type")
      addVariant("dark", ".dark &")
      addVariant("pause", "&.pause")
      
      addUtilities({
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
        ".pause": {
          "animation-play-state": "paused",
        },
        ".play": {
          "animation-play-state": "running",
        },
        ".will-change-transform": {
          "will-change": "transform",
        },
        ".transform-gpu": {
          "transform": "translateZ(0)",
          "backface-visibility": "hidden",
        },
        ".overflow-x-auto-momentum": {
          "-webkit-overflow-scrolling": "touch",
          "overflow-x": "auto"
        },
        ".text-shadow-sm": {
          "text-shadow": "0 1px 2px rgba(0, 0, 0, 0.1)"
        },
        ".text-shadow": {
          "text-shadow": "0 2px 4px rgba(0, 0, 0, 0.1)"
        },
        ".text-shadow-md": {
          "text-shadow": "0 4px 8px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08)"
        },
        ".text-shadow-lg": {
          "text-shadow": "0 15px 30px rgba(0, 0, 0, 0.11), 0 5px 15px rgba(0, 0, 0, 0.08)"
        },
        ".text-shadow-none": {
          "text-shadow": "none"
        },
        ".content-visibility-auto": {
          "content-visibility": "auto",
        },
      });
      
      // Add reusable component classes
      addComponents({
        '.card': {
          backgroundColor: 'var(--card-bg)',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 12px var(--shadow-color)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 16px var(--shadow-color-strong)',
            transform: 'translateY(-3px)',
          },
        },
      });
    },
  ],
};

