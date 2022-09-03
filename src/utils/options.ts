import { colors, SelectValueOptions } from "../../deps.ts";

import * as version from "./version.ts";
import * as constants from "../constants.ts";

function addExtraOptionsIfNecessary(
  options: SelectValueOptions,
  tagName: string,
  currentKind: string,
  targetKind: string,
) {
  addNoneOptionIfNecessary(currentKind, targetKind, options, tagName);
  addPrereleaseOptionIfNecessary(currentKind, targetKind, options, tagName);
}

function addNoneOptionIfNecessary(
  currentKind: string,
  targetKind: string,
  options: SelectValueOptions,
  tagName: string,
) {
  const isCurrentKindStable = currentKind === constants.TEXT_STABLE;
  const isTargetKindStable = targetKind === constants.TEXT_STABLE;

  if (isCurrentKindStable === false && isTargetKindStable) {
    const versionWithoutPrerelease = version.getWithoutPrerelease(
      tagName,
    );

    options.unshift({
      name: `${constants.EMOJI_NONE} ${constants.TEXT_NONE} (${
        colors.bold.yellow(versionWithoutPrerelease)
      })`,
      value: versionWithoutPrerelease,
    });
  }
}

function addPrereleaseOptionIfNecessary(
  currentKind: string,
  targetKind: string,
  options: SelectValueOptions,
  tagName: string,
) {
  const isCurrentAndTargetKindEqual = currentKind === targetKind;
  const isTargetKindStable = targetKind === constants.TEXT_STABLE;

  if (isCurrentAndTargetKindEqual && isTargetKindStable === false) {
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
