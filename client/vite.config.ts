import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const srcPath = resolve(__dirname, 'src');

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      app: resolve(srcPath, 'app'),
      pages: resolve(srcPath, 'pages'),
      widgets: resolve(srcPath, 'widgets'),
      features: resolve(srcPath, 'features'),
      entities: resolve(srcPath, 'entities'),
      shared: resolve(srcPath, 'shared'),
    },
  },
});
