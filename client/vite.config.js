import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// base is set to the GitHub Pages repo name for correct asset paths
export default defineConfig({
  plugins: [react()],
  base: '/smart-paper-mill/',
})
