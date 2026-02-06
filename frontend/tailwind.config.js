export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        sidebar: {
          bg: "#1d2330",
          hover: "#2a3040",
          active: "#3a4050",
          border: "#333",
        },
        primary: {
          DEFAULT: "#0070F2",
          hover: "#0050c0",
          light: "#e0e7ff",
        },
        success: "#107e3e",
        warn: "#e9730c",
        error: "#bb0000",
      },
    },
  },
  plugins: [],
}
