import { UserConfig } from 'vite'
import { resolve } from 'path'

const config: UserConfig = {
  root: __dirname,
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  build: {
    target: 'esnext',
    outDir: resolve(__dirname, './dist'),
    lib: {
      entry: resolve(__dirname, './src/index.ts'),
      formats: ['cjs']
    },
    rollupOptions: {
      external: ['path', 'child_process', 'fs', 'chalk', 'commander', 'download-git-repo', 'inquirer', 'log-symbols', 'ora'],
      output: {
        entryFileNames: '[name].js'
      }
    },
    ssr: false,
    ssrManifest: false,
    emptyOutDir: true
  }
}

export default config
