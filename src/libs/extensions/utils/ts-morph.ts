import { GluegunToolbox } from 'gluegun'
import Project, { SourceFile } from 'ts-morph'
import * as R from 'ramda'

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

  addNamedImports(fromModule: string, namedImports: string[]) {
    const { sourceFile } = this

    let existingNamedImports = []
    const existings = sourceFile.getImportDeclaration(fromModule)

    if (existings) {
      existingNamedImports = existings
        .getNamedImports()
        .map(nameImport => nameImport.getText)
      existings.remove()
    }

    sourceFile.addImportDeclaration({
      moduleSpecifier: fromModule,
      namedImports: R.uniq([...namedImports, ...existingNamedImports]).sort()
    })
  }
}
