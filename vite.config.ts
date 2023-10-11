import { UserConfig } from 'vite'
import { resolve } from 'path'

/**
 * 配置文件
 */
const config: UserConfig = {
  root: __dirname,
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  build: {
    target: 'node16',
    outDir: resolve(__dirname, './dist'),
    lib: {
      entry: resolve(__dirname, './src/index.ts'),
      formats: ['es']
    },
    rollupOptions: {
      external: ['update-notifier', 'url', 'path', 'child_process', 'fs', 'chalk', 'commander', 'download-git-repo', 'inquirer', 'log-symbols', 'ora'],
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
