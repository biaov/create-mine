import { resolve } from 'path'
import external from './scripts/external'
import rollupPluginCopy from './scripts/rollup-plugin-copy'

const { dirname } = import.meta

/**
 * 配置文件
 */
export default {
  resolve: {
    alias: {
      '@': resolve(dirname, './src')
    }
  },
  build: {
    target: 'node20',
    outDir: './dist/dist',
    lib: {
      entry: './src/index.ts',
      formats: ['es']
    },
    rollupOptions: {
      external: [...external, 'path', 'child_process', 'fs'],
      output: {
        entryFileNames: '[name].js'
      },
      plugins: [rollupPluginCopy()]
    },
    ssr: false,
    ssrManifest: false,
    emptyOutDir: true
  }
}
