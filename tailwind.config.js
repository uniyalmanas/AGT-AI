/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#f0f7ff",
          100: "#e0effe",
          200: "#bae0fd",
          300: "#7cc8fb",
          400: "#38aaf6",
          500: "#0e8de6",
          600: "#026fc4",
          700: "#0358a0",
          800: "#074b84",
          900: "#0c3f6d",
          950: "#082849",
        },
        ink: {
          900: "#0f172a",
          700: "#1e293b",
          500: "#334155",
          400: "#475569",
          300: "#64748b",
          200: "#94a3b8",
          100: "#cbd5e1",
          50:  "#f1f5f9",
        },
        success: { bg: "#f0fdf4", border: "#bbf7d0", text: "#15803d" },
        warning: { bg: "#fffbeb", border: "#fde68a", text: "#b45309" },
        danger:  { bg: "#fff1f2", border: "#fecdd3", text: "#be123c" },
        info:    { bg: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8" },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: { xl: "0.875rem", "2xl": "1.25rem" },
    },
  },
  plugins: [],
};
