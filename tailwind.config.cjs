module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      boxShadow: {
        soft: '0 24px 80px rgba(15, 23, 42, 0.12)',
      },
      backgroundImage: {
        hero: 'linear-gradient(135deg, rgba(34,139,230,0.18), rgba(168,85,247,0.14))',
      },
    },
  },
  plugins: [],
};
