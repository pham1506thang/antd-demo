import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src'),
      api: path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        './src/api'
      ),
      components: path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        './src/components'
      ),
      pages: path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        './src/pages'
      ),
      models: path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        './src/models'
      ),
      store: path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        './src/store'
      ),
      utils: path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        './src/utils'
      ),
      styles: path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        './src/styles'
      ),
    },
  },
});
