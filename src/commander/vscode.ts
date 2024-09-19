import download from 'download-git-repo' // 用于下载项目模板
import { cpSync, rmSync } from 'fs' // 读写文件
import { join } from 'path'
import type { DownloadVSCodeConfig } from './types'

const fileOption = { recursive: true, force: true }

/**
 * 下载 vscode 配置文件
 */
export const downloadVSCodeConfig = ({ projectName }: DownloadVSCodeConfig.Option) => {
  const tempFileName = `${+new Date()}`
  const projectPath = join(process.cwd(), projectName)
  const tempPath = join(projectPath, tempFileName)

  download(`direct:${import.meta.env.VITE_VSCODE_GIT_URL}`, tempPath, { clone: true }, async (err: Error): Promise<void> => {
    !err && cpSync(join(tempPath, '.vscode'), join(projectPath, '.vscode'), fileOption)
    rmSync(tempPath, fileOption)
  })
}
