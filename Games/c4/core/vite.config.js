import { defineConfig } from 'vite'
import { resolve } from 'path' 
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib.ts'),
      name: '@kenrick95/c4',
      fileName: 'c4',
      formats: ['cjs', 'es', 'umd'],
    },
  },
  plugins: [dts()],
  test: {
    include: [
      '**/__tests__/**/*.[jt]s?(x)',
      '**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
  },
})
