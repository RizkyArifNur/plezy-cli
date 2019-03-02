import { GluegunToolbox } from 'gluegun'
import { Project } from 'ts-morph'
import { TsMorph } from './ts-morph'
import { format } from 'prettier'

export class Utils {
  context: GluegunToolbox
  project: Project
  constructor(context: GluegunToolbox) {
    this.context = context
  }

  loadAsProject() {
    const {
      filesystem: { exists, cwd },
      print
    } = this.context

    if (!exists('tsconfig.json')) {
      print.error('tsconfig.json is missing')
      process.exit(0)
      return
    }

    const tsconfig = cwd('tsconfig.json').cwd()
    this.project = new Project({
      tsConfigFilePath: `${tsconfig}`,
      addFilesFromTsConfig: false
    })
  }

  getTsMorph(filePath: string) {
    if (!this.project) {
      this.loadAsProject()
    }

    this.project.addExistingSourceFile(filePath)
    return new TsMorph(this.context, this.project, filePath)
  }

  /**
   * get prettier config from root project, with the identifier is file .prettierrc
   */

  getPrettierConfig() {
    const {
      filesystem: { read, cwd }
    } = this.context

    const prettierConfig = read(cwd('.prettierrc').cwd())
    if (!prettierConfig) {
      return {
        semi: false,
        singleQuote: true
      }
    }
    return JSON.parse(prettierConfig)
  }

  /**
   * Format sourcecode
   * @param filePath location of file to save
   * @param source contents of file that want to be formated
   */
  prettify(filePath: string, source?: string) {
    const {
      filesystem: { write, read }
    } = this.context

    if (!source) {
      source = read(filePath)
    }

    write(
      filePath,
      format(source, {
        parser: 'typescript',
        ...this.getPrettierConfig()
      })
    )
  }
}
