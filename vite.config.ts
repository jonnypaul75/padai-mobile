import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
   
  ],
   resolve: {
    alias: {
      'pdfjs-dist/build/pdf.worker.min.js': 'pdfjs-dist/build/pdf.worker.min.js',
    },
  },
})
