import { colors } from "../../deps.ts";
import * as constants from "../constants.ts";

function error(message: string) {
  console.error(`${constants.EMOJI_ERROR} ${colors.red(message)}`);
}

function warn(message: string) {
  console.warn(`${constants.EMOJI_WARNING} ${colors.yellow(message)}`);
}

function info(message: string) {
  console.info(
    `${constants.EMOJI_INFORMATION} ${colors.magenta(message)}`,
  );
}

function task(message: string) {
  console.info(`${constants.EMOJI_TASK} ${colors.green(message)}`);
}

export { error, info, task, warn };
