import { InstallToolKey, TemplateUrlKey } from '@/config/types'

/**
 * 模板
 */
export interface Template {
  template: TemplateUrlKey
}

/**
 * 预设信息
 */
export interface PresetInfo extends Template {
  projectName: string
  installTool: InstallToolKey
}

/**
 * 方法 downloadVSCodeConfig
 */
export namespace DownloadVSCodeConfig {
  export interface Option {
    projectName: string
  }
}
