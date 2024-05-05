import { resolve } from 'path'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  base: 'https://devuser.4app.pro/lips',
  plugins: [tsconfigPaths()],
  assetsInclude: ['**/*.glb', '**/*.task'],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
})
