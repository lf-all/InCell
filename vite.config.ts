import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// IMPORTANTE: Altere 'excel-dashboard-vite' para o nome exato do seu repositório GitHub
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/incell/',
})
