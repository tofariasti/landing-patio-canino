import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  plugins: [react()],
  base: './',
  build: {
    outDir: '../site',
    emptyOutDir: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: '../src/test/setup.ts',
    include: ['test/**/*.test.ts', 'test/**/*.test.tsx'],
    exclude: ['e2e/**', 'node_modules/**'],
  },
})
