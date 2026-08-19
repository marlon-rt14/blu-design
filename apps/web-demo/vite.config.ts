import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // In a monorepo, workspace packages can end up with their own copy of
    // react; two instances break hooks. This forces a single one.
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    // Workspace packages are served as source (never pre-bundled), so HMR
    // also works when editing the design system.
    exclude: ['@dsm/shared', '@dsm/web'],
  },
})
