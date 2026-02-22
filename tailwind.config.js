/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0d0d12',
        'bg-dark': '#08080c',
        card: '#16161e',
        'card-light': '#1e1e28',
        border: '#2a2a38',
        'border-gold': '#c9a227',
        gold: '#ffd700',
        'gold-dark': '#c9a227',
        accent: '#7c3aed',
        'accent-light': '#a78bfa',
        danger: '#dc2626',
        'danger-light': '#ef4444',
        success: '#22c55e',
        'success-light': '#4ade80',
        hp: '#22c55e',
        'hp-dark': '#16a34a',
        mana: '#3b82f6',
        'mana-light': '#60a5fa',
        xp: '#fbbf24',
        'xp-dark': '#d97706',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold': '0 0 20px rgba(255, 215, 0, 0.3)',
        'gold-sm': '0 0 10px rgba(255, 215, 0, 0.2)',
      },
    },
  },
  plugins: [],
}
