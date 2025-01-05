import * as minimist from 'minimist'
import SourceCode from './sourceCode'
import { getPkgVersion } from './utils'

export default class CLI {
  appPath: string
  constructor (appPath) {
    this.appPath = appPath || process.cwd()
  }

  run () {
    return this.parseArgs()
  }

  async parseArgs () {
    const args = minimist(process.argv.slice(2), {
      alias: {
        version: ['v'],
        help: ['h'],
        sourceCode: ['source-code'], // 分析源码命令
        outputFile: ['output-file'], // 输出报告markdown文件
      },
      boolean: ['version', 'help'],
      default: {
        build: true,
      },
    })
    // 参数列表
    const _ = args._
    const command = _[0]
    if (command) {
      switch (command) {
        case 'sourceCode': {
          new SourceCode({
            analysisDirectoryPath: args.sourceCode || './src',
            outputFile: args.outputFile || './analysis.md',
          }).analysis();
          break
        }
        default:
          break
      }
    } else {
      if (args.h) {
        console.log('Usage: analysis <command> [options]')
        console.log()
        console.log('Options:')
        console.log('  -v, --version       output the version number')
        console.log('  -h, --help          output usage information')
        console.log()
        console.log('Commands:')
        console.log('  sourceCode          analysis project source code')
      } else if (args.v) {
        console.log(getPkgVersion())
      }
    }
  }
}
