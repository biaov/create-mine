const chokidar = require('chokidar')
const { exec } = require('child_process')
const { resetPath } = require('./path')
const { log, debounce } = require('./hooks')

const watcher = chokidar.watch(resetPath('@/src'), {
  ignored: ['**/node_modules/**', '**/.git/**', '**/.vscode/**', '**/scripts/**', '**/dist/**'],
  ignoreInitial: true,
  ignorePermissionErrors: true,
  disableGlobbing: true
})

watcher.on(
  'all',
  debounce(() => {
    exec('npm run build', log)
  }, 2000)
)
