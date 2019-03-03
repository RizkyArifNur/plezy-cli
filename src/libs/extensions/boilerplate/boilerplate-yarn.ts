import { GluegunToolbox } from 'gluegun'

export async function boilerPlateYarn(
  projectName: string,
  context: GluegunToolbox
) {
  const { system, print, filesystem } = context

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

  /**
   * make project directory
   */
  try {
    await system.run(`mkdir ${projectName}`)
  } catch (error) {
    print.error(
      'Error when try to create the folder, please unsure that you have permission to this directory..'
    )
    return process.exit(0)
  }

  const spinner = print.spin(`Creating your project ...`)

  /**
   * initialize project
   */
  try {
    await system.run(
      `cd ${projectName}; yarn init --yes; yarn add express; yarn add -D @types/express nodemon tsc; tsc --init`
    )
  } catch (error) {
    print.error('Error when try to initialize the project')
    return process.exit(0)
  }

  const pkg = JSON.parse(filesystem.read(`${projectName}/package.json`))

  pkg.scripts = {
    build: 'tsc'
  }

  filesystem.write(`${projectName}/package.json`, pkg)

  spinner.succeed()
}
