const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    // Rename Tailwind's --tw-* variables in the output (see the file for why).
    "./build-tools/postcss-hide-tw.cjs": {},
  },
};

export default config;
