import { GluegunToolbox } from 'gluegun'
import { boilerPlateYarn } from '../libs/extensions/boilerplate/boilerplate-yarn'

export default {
  name: 'init',
  run: async (toolbox: GluegunToolbox) => {
    const { parameters } = toolbox

    await boilerPlateYarn(parameters.first, toolbox)
  }
}
