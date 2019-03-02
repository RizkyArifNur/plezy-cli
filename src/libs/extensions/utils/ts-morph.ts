import { GluegunToolbox } from 'gluegun'
import Project from 'ts-morph'

export class TsMorph {
  context: GluegunToolbox
  constructor(context: GluegunToolbox, project: Project, filePath: string) {
    this.context = context
  }
}
