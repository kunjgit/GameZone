import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    conditions: ['__source', 'import', 'module', 'browser', 'default'],
  },
})
