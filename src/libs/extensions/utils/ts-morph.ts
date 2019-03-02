import { GluegunToolbox } from 'gluegun'
import Project, { SourceFile } from 'ts-morph'

export class TsMorph {
  context: GluegunToolbox
  project: Project
  sourceFile: SourceFile
  filePath: string
  constructor(context: GluegunToolbox, project: Project, filePath: string) {
    const {
      filesystem: { cwd }
    } = context
    this.context = context
    this.project = project
    this.sourceFile = project.getSourceFile(cwd(filePath).cwd())
  }
}
