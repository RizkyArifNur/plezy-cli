import { GluegunToolbox } from 'gluegun'

export class YarnBoilerPlate {
  context: GluegunToolbox
  projectName: string
  constructor(context: GluegunToolbox, projectName: string) {
    this.context = context
    this.projectName = projectName
  }

  async init() {
    const { system, print } = this.context

    let hasYarn
    try {
      hasYarn = !!(await system.run('yarn -v'))
    } catch (error) {
      hasYarn = false
    }

    if (!hasYarn) {
      print.error(
        `The ${print.colors.yellow(
          'yarn'
        )} was not found, you must install it first.`
      )
      return process.exit(0)
    }

    const spinner = print.spin(`Creating your project ...`)
    await this.initDirectory()
    await this.initProject()
    spinner.succeed()
  }

  /**
   * make project directory
   */
  private async initDirectory() {
    const { system, print } = this.context
    try {
      await system.run(`mkdir ${this.projectName}`)
    } catch (error) {
      print.error(
        'Error when try to create the folder, please unsure that you have permission to this directory..'
      )
      return process.exit(0)
    }
  }

  /**
   * init project with yarn
   */
  private async initProject() {
    const { system, print, filesystem } = this.context
    try {
      await system.run(
        `cd ${
          this.projectName
        }; yarn init --yes; yarn add express; yarn add -D @types/express nodemon tsc; tsc --init`
      )
    } catch (error) {
      print.error('Error when try to initialize the project')
      return process.exit(0)
    }

    const pkg = JSON.parse(filesystem.read(`${this.projectName}/package.json`))

    pkg.scripts = {
      build: 'tsc'
    }

    filesystem.write(`${this.projectName}/package.json`, pkg)
  }
}
