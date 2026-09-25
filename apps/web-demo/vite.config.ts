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
    // also works when editing the design system. The icon sections are 19
    // separate specifiers per platform and `exclude` takes no patterns, so
    // they are left out: they are generated files nobody edits by hand, and
    // pre-bundling them is in fact what keeps a 2.3 MB module graph from
    // reaching the browser one request per section.
    exclude: ['@dsm/shared', '@dsm/web'],
  },
})
