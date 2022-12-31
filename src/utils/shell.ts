import { colors } from "../../deps.ts";
import * as constants from "../constants.ts";

async function runCommand(
  commandName: string,
  commandArguments: string[] = [],
) {
  console.info(constants.EMOJI_SHELL, commandName, ...commandArguments);

  const command = new Deno.Command(commandName, {
    args: commandArguments,
    stdout: "piped",
    stderr: "piped",
  });

  const { code, stdout, stderr } = await command.output();

  const output = new TextDecoder().decode(stdout).trim();
  const errorOutput = new TextDecoder().decode(stderr).trim();

  return { code, output, errorOutput };
}

function printErrorMessage(output: string, errorOutput: string) {
  const errorMessage = output.length > 0 ? output : errorOutput;
  console.error(`${constants.EMOJI_ERROR} ${colors.bold.red(errorMessage)}`);
}

export { printErrorMessage, runCommand };
