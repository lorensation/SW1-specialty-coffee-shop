import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// importante: rutas relativas en el build
export default defineConfig({
  base: './',
  plugins: [react()],
})
