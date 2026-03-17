import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/',           // ← Essencial para Vercel (era o problema da tela branca)
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
