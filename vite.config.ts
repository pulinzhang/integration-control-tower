import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    // Use esbuild minification (default, no extra install needed)
    minify: 'esbuild',
  },
})
