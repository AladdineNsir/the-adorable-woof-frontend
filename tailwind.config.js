/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: { 
        'velora-dark': '#1F1713',
        'velora-black': '#0D0D0D',
        'velora-cream': '#F8F5EF',
        'velora-gold': '#C95318',
        'velora-goldHover': '#8B3A12',
        'velora-goldDeep': '#B5742E',
        'velora-textGray': '#7B675D',
        'velora-textMuted': '#8B7B6B',
        'velora-border': '#EFE7DC',
        'velora-borderSoft': '#E7DED2',
        'velora-ivory': '#FAF7F2',
        'velora-white': '#FFFFFF',
        'velora-orange': '#A94716',
        'velora-orangeDark': '#8B3A12',

        'smiley-pink': '#A94716',
        'smiley-pink-bright': '#8B3A12',
        'smiley-pink-soft': '#F3E7DC',
        'smiley-pink-light': '#FCFAF7',
        'smiley-pink-pale': '#FFF8EF',
        'smiley-rose': '#A94716',
        'smiley-rose-dark': '#8B3A12',
        'smiley-rose-deep': '#B5742E',
        'smiley-cream': '#F8F5EF',
        'smiley-white': '#FFFFFF',
        'smiley-border': '#E7DED2',
        'smiley-soft-border': '#F0E5DC',
        'smiley-success': '#22A06B',
        'smiley-error': '#DC3545',
        'smiley-warning': '#C96A26',
      },
      boxShadow: {
        'smiley-soft': '0 10px 30px rgba(31, 23, 19, 0.08)',
        'smiley-soft-hover': '0 16px 40px rgba(31, 23, 19, 0.12)',
        'smiley-button': '0 8px 24px rgba(201, 106, 38, 0.18)',
      },
      fontFamily: {
        'premium': ['"Playfair Display"', 'serif'],
      }
    },
  },
  plugins: [],
}