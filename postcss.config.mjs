// Tailwind is only imported by app/admin/admin.css, so it never reaches the
// public site, which keeps its own Bootstrap theme.
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
