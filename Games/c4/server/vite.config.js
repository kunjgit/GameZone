import { defineConfig } from 'vite'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'node18',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['ws', 'crypto'],
    },
  },
  resolve: {
    browserField: false,
    conditions: [
      '__source',
      'import',
      'module',
      // Bug with Vite? If I don't specify "node" here, it sneakily include "browser" by default ._. https://github.com/vitejs/vite/blob/6a144636d0653c9bd94b06df1b63e418d9015e3f/packages/vite/src/node/plugins/resolve.ts#L1119
      'node',
      'default',
    ],
  },
})
