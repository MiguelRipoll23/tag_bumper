import * as constants from "../constants.ts";

async function runCommand(
  command: string,
  args: string[] = [],
) {
  console.info(constants.EMOJI_SHELL, command, ...args);

  const { code, stdout, stderr } = await Deno.spawn(command, {
    args,
  });

  const output = new TextDecoder().decode(stdout).trim();
  const errorOutput = new TextDecoder().decode(stderr).trim();

  return { code, output, errorOutput };
}

export { runCommand };
