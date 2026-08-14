/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: "#0a0c0f",
        panel: "#14171c",
        raised: "#1b1f25",
        raised2: "#20252b",
        hair: "#262b32",
        ink: "#e7ecef",
        mute: "#8b95a1",
        signal: {
          DEFAULT: "#39c98f",
          dim: "#1f6b4d",
          bright: "#5be3ac",
        },
        amber: {
          DEFAULT: "#f0a63d",
          dim: "#8a5f22",
        },
        // Added for this project: OSNOVA's palette has no destructive/danger
        // color defined (it never needed one). This is the same hue family
        // as the old --red (#f76384) used for "delete/clear" actions here,
        // kept subdued so it doesn't compete with signal green.
        danger: {
          DEFAULT: "#f2545b",
          dim: "#7a2429",
        },
      },
      fontFamily: {
        display: ["Rajdhani", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        shutter:
          "repeating-linear-gradient(180deg, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 2px, transparent 2px, transparent 8px)",
      },
      boxShadow: {
        chip: "inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -6px 10px rgba(0,0,0,0.25)",
        card: "0 10px 30px rgba(0, 0, 0, 0.4)",
      },
    },
  },
  plugins: [],
};
