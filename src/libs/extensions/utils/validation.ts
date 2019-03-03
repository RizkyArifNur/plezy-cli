import { GluegunToolbox } from 'gluegun'

/**
 * validate the given commands
 * @param context gluegun toolbox
 * @param commands commands in string, if your want to validate many commands just separate with semicolon
 * return @true if commands is valid and otherwise
 */
export async function validateCommands(
  context: GluegunToolbox,
  commands: string
): Promise<boolean> {
  const { system } = context
  try {
    await system.run(commands)
    return true
  } catch (error) {
    return false
  }
}

export async function validateDirectory(
  context: GluegunToolbox,
  directory: string
): Promise<Boolean> {
  const { filesystem } = context
  try {
    await filesystem.existsAsync(directory)
    return true
  } catch (error) {
    return false
  }
}
