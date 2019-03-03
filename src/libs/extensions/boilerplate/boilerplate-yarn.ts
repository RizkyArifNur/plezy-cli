import { GluegunToolbox } from 'gluegun'

export async function boilerPlateYarn(
  projectName: string,
  context: GluegunToolbox
) {
  const { system, print } = context

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

  try {
    await system.run(`mkdir ${projectName}; cd ${projectName}`)
  } catch (error) {
    print.error(
      'Error when try to create the folder, please unsure that you have permission to this directory..'
    )
    return process.exit(0)
  }

  try {
    await system.run('yarn init --yes; yarn add express ')
  } catch (error) {
    print.error('Error when try to initialize the project')
    return process.exit(0)
  }
}
