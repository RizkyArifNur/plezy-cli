import { GluegunToolbox } from 'gluegun'
import Project, { SourceFile } from 'ts-morph'
import * as R from 'ramda'
import { Utils } from './utils'

export class TsMorph {
  context: GluegunToolbox
  project: Project
  sourceFile: SourceFile
  filePath: string
  utils: Utils
  constructor(
    context: GluegunToolbox,
    project: Project,
    filePath: string,
    utils: Utils
  ) {
    const {
      filesystem: { cwd }
    } = context
    this.context = context
    this.project = project
    this.sourceFile = project.getSourceFile(cwd(filePath).cwd())
    this.utils = utils
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

  save() {
    const { prettify } = this.utils
    prettify(this.sourceFile.getFilePath(), this.sourceFile.getText())
  }
}
