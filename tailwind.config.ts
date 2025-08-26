import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'wa-beige': '#F5F3F0',
        'wa-cream': '#FFF8DC',
        'wa-brown': '#8B4513',
        'wa-red': '#DC143C',
        'wa-green': '#2E8B57',
        'wa-gray': '#696969',
      },
      fontFamily: {
        'noto': ['Noto Sans JP', 'sans-serif'],
        'hiragino': ['Hiragino Kaku Gothic Pro', 'Meiryo', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config