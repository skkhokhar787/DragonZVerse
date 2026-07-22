/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "background": "#001219",
        "surface": "#001219",
        "surface-dim": "#000a0d",
        "surface-container-lowest": "#000608",
        "surface-container-low": "#001f29",
        "surface-container": "#002b36",
        "surface-container-high": "#005f73",
        "surface-container-highest": "#0a9396",

        "primary": "#ee9b00",
        "primary-container": "#ca6702",
        "on-primary": "#001219",

        "secondary": "#005f73",
        "secondary-container": "#0a9396",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#e9d8a6",

        "tertiary": "#ae2012",
        "tertiary-container": "#bb3e03",
        "on-tertiary": "#ffffff",

        "on-background": "#e9d8a6",
        "on-surface": "#e9d8a6",
        "on-surface-variant": "#94d2bd",

        "outline": "#0a9396",
        "outline-variant": "#005f73",
        "error": "#9b2226",
        "error-container": "#ae2012",
        "on-error": "#ffffff",
        "on-error-container": "#e9d8a6",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      spacing: {
        unit: "4px",
        gutter: "24px",
        margin: "32px",
        "container-max": "1440px",
      },
      fontFamily: {
        "headline-lg-mobile": ["Sora"],
        "body-lg": ["Geist"],
        "label-md": ["Geist"],
        "headline-md": ["Sora"],
        "headline-lg": ["Sora"],
        "display-lg": ["Sora"],
        "body-md": ["Geist"],
      },
      fontSize: {
        "headline-lg-mobile": ["24px", { lineHeight: "1.2", fontWeight: "700" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "label-md": ["14px", { lineHeight: "1.0", letterSpacing: "0.05em", fontWeight: "600" }],
        "headline-md": ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        "headline-lg": ["32px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-lg": ["48px", { lineHeight: "1.1", letterSpacing: "-0.04em", fontWeight: "800" }],
        "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
      },
    },
  },
  plugins: [],
};
