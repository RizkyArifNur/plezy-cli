import { GluegunToolbox } from 'gluegun'
import { Project } from 'ts-morph'
import { TsMorph } from './ts-morph'

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
}
