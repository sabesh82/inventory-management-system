import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "selector",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      textColor: {
        skin: {
          primary: "rgba(var(--primary-bg), <alpha-value>)",
          "btn-text": "rgba(var(--btn-text-color), <alpha-value>)",
          "btn-spinner": "rgba(var(--btn-spinner-color), <alpha-value>)",
          "btn-disabled": "rgba(var(--btn-disabled-text-color), <alpha-value>)",
        },
      },

      backgroundColor: {
        skin: {
          primary: "rgba(var(--primary-bg), <alpha-value>)",
          "primary-dark": "rgba(var(--primary-bg-dark), <alpha-value>)",
          secondary: "rgba(var(--secondary-bg), <alpha-value>)",
          "btn-bg": "rgba(var(--btn-bg-color), <alpha-value>)",
          "btn-bg-hover": "rgba(var(--btn-bg-hover-color), <alpha-value>)",
          "btn-active": "rgba(var(--btn-bg-active-color), <alpha-value>)",
          "btn-disabled": "rgba(var(--btn-disabled-bg-color), <alpha-value>)",
        },
      },

      fill: {
        skin: {
          primary: "rgba(var(--primary-bg), <alpha-value>)",
          secondary: "rgba(var(--secondary-bg), <alpha-value>)",
        },
      },

      ringColor: {
        skin: {
          primary: "rgba(var(--primary-bg), <alpha-value>)",
          secondary: "rgba(var(--secondary-bg), <alpha-value>)",
          "btn-ring": "rgba(var(--btn-ring-color), <alpha-value>)",
        },
      },

      borderColor: {
        skin: {
          primary: "rgba(var(--primary-bg), <alpha-value>)",
          secondary: "rgba(var(--secondary-bg), <alpha-value>)",
        },
      },

      boxShadowColor: {
        skin: {
          primary: "rgba(var(--primary-bg), <alpha-value>)",
          secondary: "rgba(var(--secondary-bg), <alpha-value>)",
        },
      },

      gradientColorStops: {
        skin: {
          primary: "rgba(var(--primary-bg), <alpha-value>)",
          "primary-dark": "rgba(var(--primary-bg-dark), <alpha-value>)",
          secondary: "rgba(var(--secondary-bg), <alpha-value>)",
        },
      },
    },
  },
  plugins: [],
};
export default config;
