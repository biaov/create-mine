const { writeFileSync, copyFileSync, existsSync, readdirSync, mkdirSync } = require('fs')
const { join } = require('path')
const package = require('../package.json')
const { createServer, build, createLogger } = require('vite')
const { resetPath } = require('./path')

const sharedConfig = { logLevel: 'info' }

// vite 服务
exports.createViteBuild = () => {
  return build({
    ...sharedConfig,
    configFile: resetPath('@/vite.config.ts'),
    mode: 'production'
  })
}

// vite 打包
exports.createViteServer = () => {
  console.log({
    ...sharedConfig,
    configFile: resetPath('@/vite.config.ts')
  })
  return createServer({
    ...sharedConfig,
    configFile: resetPath('@/vite.config.ts')
  })
}

// 重写 package.json
exports.rewritePackage = () => {
  package.devDependencies = package.scripts = {}
  writeFileSync(resetPath('@/dist/package.json'), JSON.stringify(package, null, 2)) // 写入最新的
}

// 复制资源
exports.copyAssets = () => {
  const needDirs = ['bin'] // 根目录需要复制文件夹
  const filePaths = ['README.md', 'LICENSE'] // 根目录需要复制的文件
  const inputDir = resetPath('@') // 根目录
  const outputDir = resetPath('@/dist') // 输出目录

  !existsSync(outputDir) && mkdirSync(outputDir)
  needDirs.forEach(dir => {
    const dirPath = resetPath(`@/${dir}`)
    mkdirSync(join(outputDir, dir)) // 创建目录
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
  let timer // 定时器

  return e => {
    if (timer !== undefined) clearTimeout(timer) // 清理之前的操作
    timer = setTimeout(() => {
      fn(e)
    }, time)
  }
}
