import { GluegunToolbox } from 'gluegun'
import { YarnBoilerPlate } from '../libs/extensions/boilerplate/init-boilerplate'

export default {
  name: 'init',
  run: async (toolbox: GluegunToolbox) => {
    const { parameters, print, prompt } = toolbox

    if (!parameters.first) {
      print.error('Please specified the project name.')
      print.info(
        `example : plezy init ${print.colors.yellow('[your project name]')}.`
      )
      process.exit(0)
    }

    const yarn = 'Yarn'
    const npm = 'NPM'
    const { depedencyManager } = await prompt.ask([
      {
        name: 'depedencyManager',
        message: 'Select depedency manager you would like to use :',
        type: 'list',
        choices: [yarn, npm],
        default: yarn
      }
    ])

    console.log(depedencyManager)
    switch (depedencyManager) {
      case yarn:
        const yarnBoilerPlate = new YarnBoilerPlate(
          toolbox,
          parameters.first,
          true
        )
        await yarnBoilerPlate.init()

        break
      case npm:
        break
    }
  }
}
