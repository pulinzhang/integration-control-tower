/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#0D0D12',
        charcoal: '#16161D',
        'slate-dark': '#1E1E28',
        graphite: '#2A2A36',
        'electric-cyan': '#00D4FF',
        'violet-accent': '#8B5CF6',
        emerald: '#10B981',
        'amber-warning': '#F59E0B',
        coral: '#EF4444',
        'steel-blue': '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
