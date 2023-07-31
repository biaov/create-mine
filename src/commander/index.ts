import { program } from 'commander'
import { version } from '@/../package.json'
import { Create, Arguments } from './actions'

/**
 * 重置版本
 */
program.usage('[commands] [options]').version(version, '-v, --version', '输出版本号').helpOption('-h, --help', '输出所有命令')

/**
 * 定义命令
 * 注册命令的回调
 */
program.command('create [name]').description('创建初始化项目').action(Create)

/**
 * 定义顶级命令的参数语法
 */
program.arguments('<cmd> [env]').action(Arguments)
if (process.argv.length < 3) {
  Create()
} else {
  /**
   * 处理参数
   */
  program.parse(process.argv)
}
