import { GluegunToolbox } from 'gluegun'
import { YarnBoilerPlate } from '../libs/extensions/boilerplate/boilerplate-yarn'

export default {
  name: 'init',
  run: async (toolbox: GluegunToolbox) => {
    const { parameters, print } = toolbox

    if (!parameters.first) {
      print.error('Please specified the project name.')
      print.info(
        `example : plezy init ${print.colors.yellow('[your project name]')}.`
      )
      process.exit(0)
    }
    const yarnBoilerPlate = new YarnBoilerPlate(toolbox, parameters.first)
    await yarnBoilerPlate.init()
  }
}
