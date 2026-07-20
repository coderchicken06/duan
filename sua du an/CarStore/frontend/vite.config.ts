import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { rmSync } from 'node:fs'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [
    {
      name: 'clean-generated-assets',
      buildStart() {
        rmSync(resolve('../src/main/resources/static/assets'), { recursive: true, force: true })
      },
    },
    vue(),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:8082', changeOrigin: true },
      '/images': { target: 'http://localhost:8082', changeOrigin: true },
      '/videos': { target: 'http://localhost:8082', changeOrigin: true },
      '/oauth2': { target: 'http://localhost:8082', changeOrigin: true },
      '/login': { target: 'http://localhost:8082', changeOrigin: true },
      '/logout': { target: 'http://localhost:8082', changeOrigin: true },
    },
  },
  build: {
    outDir: '../src/main/resources/static',
    emptyOutDir: false,
  },
})
