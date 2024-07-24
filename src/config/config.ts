/**
 * 模板预设
 * [模板下载地址]: [模板名称, ...]
 */
const templatePresets = {
  [import.meta.env.VITE_TEMPLATE_GIT_URL]: ['vue', 'react', 'uni-app', 'electron', 'node', 'cli']
}

/**
 * 转换模板对应下载地址
 */
const templateUrlsPresets: Record<string, string> = {}
Object.entries(templatePresets).forEach(([url, presets]) => {
  presets.forEach(preset => {
    templateUrlsPresets[preset] = url
  })
})

/**
 * 模板下载地址
 */
export const templateUrls = templateUrlsPresets

/**
 * 工具对应命令
 */
export const toolCommands = {
  npm: {
    install: 'npm i',
    start: 'npm start'
  },
  cnpm: {
    install: 'cnpm i',
    start: 'cnpm start'
  },
  pnpm: {
    install: 'pnpm i',
    start: 'pnpm start'
  },
  yarn: {
    install: 'yarn',
    start: 'yarn start'
  }
}
