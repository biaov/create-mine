import { program } from 'commander' // 自动解析命令和参数
import inquirer from 'inquirer' // 用于和用户进行交互
import chalk from 'chalk' // 添加字体颜色
import ora from 'ora' // 显示动画效果
import download from 'download-git-repo' // 用于下载项目模板
import { existsSync, readFileSync, writeFileSync } from 'fs' // 读写文件
import { execSync } from 'child_process'
import log from '@/utils/log' // 日志
import { templateUrls, templateNames, installTools, toolCommands } from '@/config' // 全局变量
import { SavePresetInfo, GetPresetInfo, FormatePreset } from '@/utils/functions' // 全局方法
import { version } from '@/../package.json' // 包信息
import { PresetInfo, Template } from './types'

const { iconError, iconSuccess, success, info, error, warning } = log
const { yellow, red, blueBright, cyanBright } = chalk
const { prompt, Separator } = inquirer
const [firstInstallTool] = installTools
const [firstTemplate] = templateNames
/**
 * 创建项目命令的 action
 * @param { string } name - 命令名称
 * @returns { void }
 */
export const Create = async (name = 'project-name') => {
  /**
   * 获取预设信息
   */
  const presetInfo = GetPresetInfo()
  /**
   * 格式化预设信息
   */
  const historyList = FormatePreset(presetInfo)
  const { projectName, preset }: Record<string, any> = await prompt([
    {
      type: 'input',
      name: 'projectName',
      message: `你的项目叫什么名称？`,
      default: name,
      validate(input: string): boolean {
        // 是否存在名称
        if (input || name) {
          /**
           * 文件名称路径
           */
          const fileName = `${process.cwd()}\\${input || name}`
          if (existsSync(fileName)) {
            warning('项目名称已存在')
            return false
          } else {
            return true
          }
        } else {
          warning('项目名称不能为空')
          return false
        }
      }
    },
    {
      type: 'list',
      name: 'preset',
      message: '请选择预设：',
      choices: [...historyList, `默认预设（${yellow('vue')}, ${yellow('npm')}）推荐`, '自义定预设']
    }
  ])
  /**
   * 是否自定义预设
   */
  if (preset === '自义定预设') {
    /**
     * 选择模板
     */
    const templateRes = await prompt([
      {
        type: 'list',
        name: 'template',
        message: '请选择你需要下载的模板？',
        default: [firstTemplate],
        choices: [...templateNames]
      }
    ])
    const { template } = templateRes as Template
    /**
     * 选择安装工具
     */
    const { installTool } = await prompt([
      {
        type: 'list',
        name: 'installTool',
        message: '需要使用什么工具来安装项目依赖？',
        default: [firstInstallTool],
        choices: [...installTools, new Separator(yellow('（请确保你本地有此工具，不然会安装失败）'))]
      }
    ])

    /**
     * 保存预设？
     */
    const { isSave } = await prompt([
      {
        type: 'confirm',
        name: 'isSave',
        message: '是否要保存你的预设？'
      }
    ])
    /**
     * 是否保存预设
     */
    if (isSave) {
      /**
       * 设置预设名称
       */
      const { presetName } = await prompt([
        {
          type: 'input',
          name: 'presetName',
          message: '自定义预设叫什么名称？',
          validate(input: string): boolean {
            /**
             * 是否存在名称
             */
            if (input) {
              return true
            } else {
              warning('请输入自定义预设名称')
              return false
            }
          }
        }
      ])
      /**
       * 保存信息
       */
      SavePresetInfo(presetName, { installTool, template })
    }
    /**
     * 默认预设
     */
    DownLibrary({ installTool, projectName, template })
  } else if (preset.includes('默认预设')) {
    /**
     * 默认预设
     */
    DownLibrary({ installTool: firstInstallTool, projectName, template: firstTemplate })
  } else {
    const curPresetInfo = presetInfo[preset.match(/.+(?=\（)/)]
    /**
     * 下载模板
     */
    DownLibrary({ ...curPresetInfo, projectName })
  }
}

/**
 * 定义顶级命令的 action
 * @param { any } name - 第一个命令
 * @param { any } [name=undefined] - 第二个命令
 * @returns { void }
 */
export const Arguments = (cmd: any, env: any) => {
  /**
   * 输出错误
   */
  error(`\`me ${cmd}${env ? ` ${env}` : ''}\` 命令不存在`)
  /**
   * 显示全部命令
   */
  program.help()
}

/**
 * 下载远层模板仓库
 * @param { Array<string> } args - 预设数组
 * @param { string } name - 项目名称
 * @returns { void }
 */
export const DownLibrary = ({ installTool, projectName, template }: PresetInfo) => {
  const processCwd = `${process.cwd()}\\${projectName}`
  info()
  info(blueBright(`create-mine v${version}`))
  info()
  info(`${yellow('>>')} 在此目录下创建项目：${yellow(processCwd)}`)
  const spinner = ora({ text: '正在下载模板中...', color: 'yellow' })
  spinner.start()

  download(`direct:${templateUrls[template]}#${template}`, processCwd, { clone: true }, async (err: Error): Promise<void> => {
    /**
     * 是否存在错误
     */
    if (err) {
      spinner.fail()
      info(iconError + red(err))
    } else {
      const fileName = `${processCwd}\\package.json`
      /**
       * 是否存在 package.json 文件
       */
      if (existsSync(fileName)) {
        /**
         * 读取需要修改的文件
         */
        const content = JSON.parse(readFileSync(fileName).toString())
        content.name = projectName
        /**
         * 重新写入文件
         */
        writeFileSync(fileName, JSON.stringify(content, null, 2))
      }
      /**
       * 下载成功
       */

      spinner.succeed('模板下载成功')
      info()
      spinner.start(`>> 正在安装依赖插件，可能要等一会...`)
      const { install, start } = toolCommands[installTool]
      execSync(install, {
        cwd: processCwd
      })
      spinner.succeed('依赖插件安装成功')
      info()
      success(iconSuccess + ' 项目初始化完成')
      info()
      info(`${yellow('$')}  ${cyanBright(`cd ${projectName}`)}    进入项目目录`)
      info(`${yellow('$')}  ${cyanBright(start)}    运行项目`)
      info()
      process.exit(0)
    }
  })
}
