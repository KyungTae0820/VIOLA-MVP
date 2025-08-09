/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 20s linear infinite',
      },
      boxShadow: {
        'inset-xl': 'inset 0 6px 16px rgba(0, 0, 0, 0.15)',
      },
      colors: {
        success: '#4ade80',
        warning: '#facc15',
        error: '#f87171',
        // Profile Tag Colors
        'profile-tag-viola': '#D6CCFA',
        'profile-tag-ar': '#C5F1E2',
        'profile-tag-artist': '#FDD5D1',

        // Profile Badge Text Color
        'profile-text-viola': '#6D28D9',
        'profile-text-ar': '#1E766E',
        'profile-text-artist': '#D24D0F',
      },
    },
  },
  plugins: [],
}
