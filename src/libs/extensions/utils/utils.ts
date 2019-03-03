import { GluegunToolbox } from 'gluegun'
import { Project } from 'ts-morph'
import { TsMorph } from './ts-morph'
import { format } from 'prettier'
import * as path from 'path'
import { GluegunFileSystemInspectTreeResult } from 'gluegun-fix'

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
    return new TsMorph(this.context, this.project, filePath, this)
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

  /**
   * get relative path from target to source
   * @param source source path
   * @param target target path
   */

  relativePath(source: string, target: string) {
    const {
      filesystem: { cwd }
    } = this.context
    let result = path.relative(
      cwd(path.join('src', target)).cwd(),
      cwd(path.join('src', source)).cwd()
    )

    const info = path.parse(result)
    if (info.dir.indexOf('..') > 0) {
      result = `.` + path.sep + result
    }

    return result.replace(/\\/g, '/')
  }

  /**
   * get file list of directory
   * @param directory path to directory
   */
  async fileList(directory: string) {
    const {
      filesystem: { inspectTreeAsync }
    } = this.context

    const tree = ((await inspectTreeAsync(
      directory
    )) as any) as GluegunFileSystemInspectTreeResult
    if (!tree || !tree.children || !tree.children.length) {
      return []
    }

    return tree.children.filter(child => child.type === 'file')
  }

  /**
   * get directory inside of target directory
   * @param directory path to directory
   */
  async dirList(directory: string) {
    const {
      filesystem: { inspectTreeAsync }
    } = this.context
    const tree = ((await inspectTreeAsync(
      directory
    )) as any) as GluegunFileSystemInspectTreeResult
    if (!tree || !tree.children || !tree.children.length) {
      return []
    }

    return tree.children.filter(child => child.type === 'dir')
  }

  /**
   * get directory names inside of target directory
   * @param directory
   */
  async getDirNames(directory: string) {
    const dirs = (await this.dirList(directory)).map(d => '/' + d.name)
    if (dirs.length) {
      dirs.splice(0, 0, '/')
    }
    return dirs
  }
}
