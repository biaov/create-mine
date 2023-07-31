const { writeFileSync, copyFileSync, existsSync, readdirSync, mkdirSync } = require('fs')
const { join } = require('path')
const package = require('../package.json')
const { createServer, build, createLogger } = require('vite')
const { resetPath } = require('./path')

const sharedConfig = { logLevel: 'info' }

/**
 * vite 服务
 */
exports.createViteBuild = () =>
  build({
    ...sharedConfig,
    configFile: resetPath('@/vite.config.ts'),
    mode: 'production'
  })

/**
 * vite 打包
 */
exports.createViteServer = () =>
  createServer({
    ...sharedConfig,
    configFile: resetPath('@/vite.config.ts')
  })

/**
 * 重写 package.json
 */
exports.rewritePackage = () => {
  package.devDependencies = package.scripts = {}
  /**
   * 写入最新的
   */
  writeFileSync(resetPath('@/dist/package.json'), JSON.stringify(package, null, 2))
}

/**
 * 复制资源
 */
exports.copyAssets = () => {
  /**
   * 根目录需要复制文件夹
   */
  const needDirs = ['bin']
  /**
   * 根目录需要复制的文件
   */
  const filePaths = ['README.md', 'LICENSE']
  /**
   * 根目录
   */
  const inputDir = resetPath('@')
  /**
   * 输出目录
   */
  const outputDir = resetPath('@/dist')

  !existsSync(outputDir) && mkdirSync(outputDir)
  needDirs.forEach(dir => {
    const dirPath = resetPath(`@/${dir}`)
    /**
     * 创建目录
     */
    mkdirSync(join(outputDir, dir))
    readdirSync(dirPath).forEach(file => {
      filePaths.push(`${dir}/${file}`)
    })
  })

  filePaths.forEach(path => {
    copyFileSync(join(inputDir, path), join(outputDir, path))
  })
}

const logger = createLogger('warn', {
  prefix: '[ 日志 ]'
})

exports.log = (error, stdout) => {
  if (!(error && error.toString().trim())) return
  logger.warn(error.toString(), { timestamp: true })
  stdout && logger.warn(stdout, { timestamp: true })
}

exports.debounce = (fn, time = 300) => {
  /**
   * 定时器
   */
  let timer

  return e => {
    /**
     * 清理之前的操作
     */
    timer !== undefined && clearTimeout(timer)
    timer = setTimeout(() => {
      fn(e)
    }, time)
  }
}
