import { colors, SelectValueOptions } from "../../deps.ts";

import * as version from "./version.ts";
import * as constants from "../constants.ts";

function addExtraOptionsIfNecessary(
  options: SelectValueOptions,
  tagName: string,
  currentKind: string,
  targetKind: string,
) {
  if (targetKind === constants.TEXT_STABLE) {
    if (currentKind === constants.TEXT_STABLE) {
      return;
    }

    const versionWithoutPrerelease = version.getWithoutPrerelease(
      tagName,
    );

    options.unshift({
      name: `${constants.EMOJI_NONE} ${constants.TEXT_NONE} (${
        colors.bold.yellow(versionWithoutPrerelease)
      })`,
      value: versionWithoutPrerelease,
    });
  } else {
    if (currentKind !== targetKind) {
      return;
    }

    const prereleaseVersion = version.getPrerelease(tagName, targetKind);

    options.unshift({
      name: `${constants.EMOJI_PRERELEASE} ${constants.TEXT_PRERELEASE} (${
        colors.bold.green(prereleaseVersion)
      })`,
      value: prereleaseVersion,
    });
  }
}

export { addExtraOptionsIfNecessary };
