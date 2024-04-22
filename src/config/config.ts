/**
 * 默认的模板地址，也可以配置其它模板地址
 * 其它模板地址: https://github.com/biaov/project-template.git
 */
const defaultTemplateUrl = 'https://gitee.com/biaovorg/project-template.git'

/**
 * 模板预设
 * [模板下载地址]: [模板名称, ...]
 */
const templatePresets = {
  [defaultTemplateUrl]: ['vue', 'react', 'uni-app', 'electron', 'node', 'cli']
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
