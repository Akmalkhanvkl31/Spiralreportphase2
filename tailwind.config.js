module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensure this is correctly pointing to your JSX files
  ],
  theme: {
    extend: {},
  },
  safelist: [
    'bg-[#EF4444]', // Add this line to ensure the custom color is not purged
  ],
  plugins: [],
};
