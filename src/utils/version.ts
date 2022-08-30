import { semver } from "../../deps.ts";

import * as constants from "../constants.ts";

function formatWithEmoji(tagName: string, currentKind: string) {
  let emoji = constants.EMOJI_UNKNOWN;

  switch (currentKind) {
    case constants.TEXT_STABLE:
      emoji = constants.EMOJI_STABLE;
      break;

    case constants.TEXT_BETA:
      emoji = constants.EMOJI_BETA;
      break;

    case constants.TEXT_ALPHA:
      emoji = constants.EMOJI_ALPHA;
      break;
  }

  return `${emoji} ${tagName}`;
}

function getKind(version: string) {
  const prerelease = semver.prerelease(version);

  if (prerelease === null) {
    return constants.TEXT_STABLE;
  } else if (prerelease.includes(constants.TEXT_BETA)) {
    return constants.TEXT_BETA;
  } else if (prerelease.includes(constants.TEXT_ALPHA)) {
    return constants.TEXT_ALPHA;
  } else {
    return prerelease.toString();
  }
}

function getMajor(
  tagName: string,
  targetKind = constants.TEXT_EMPTY,
) {
  const targetVersion = semver.parse(tagName);

  if (targetVersion === null) {
    return constants.TEXT_EMPTY;
  }

  targetVersion.major++;
  targetVersion.minor = 0;
  targetVersion.patch = 0;

  resetPrerelease(targetVersion, targetKind);

  return formatVersion(tagName, targetVersion);
}

function getMinor(
  tagName: string,
  targetKind = constants.TEXT_EMPTY,
) {
  const targetVersion = semver.parse(tagName);

  if (targetVersion === null) {
    return constants.TEXT_EMPTY;
  }

  targetVersion.minor++;
  targetVersion.patch = 0;

  resetPrerelease(targetVersion, targetKind);

  return formatVersion(tagName, targetVersion);
}

function getPatch(
  tagName: string,
  targetKind = constants.TEXT_EMPTY,
) {
  const targetVersion = semver.parse(tagName);

  if (targetVersion === null) {
    return constants.TEXT_EMPTY;
  }

  targetVersion.patch++;

  resetPrerelease(targetVersion, targetKind);

  return formatVersion(tagName, targetVersion);
}

function getPrerelease(
  tagName: string,
  targetKind = constants.TEXT_EMPTY,
) {
  const targetVersion = semver.parse(tagName);

  if (targetVersion === null) {
    return constants.TEXT_EMPTY;
  }

  updatePrerelease(targetVersion, targetKind);

  return formatVersion(tagName, targetVersion);
}

function updatePrerelease(targetVersion: semver.SemVer, targetKind: string) {
  const prerelease = targetVersion.prerelease;
  const currentKind = prerelease[0] as string;
  const currentCount = prerelease[1] as number;

  // Add prerelease kind
  targetVersion.prerelease[0] = targetKind;

  // Update kind count
  if (currentKind === targetKind) {
    // Increment prerelease count if same kind
    targetVersion.prerelease[1] = currentCount + 1;
  } else {
    // Set prerelease count to 1 if different kind
    targetVersion.prerelease[1] = 1;
  }
}

function resetPrerelease(
  targetVersion: semver.SemVer,
  targetKind = constants.TEXT_EMPTY,
) {
  // Remove prerelease if stable
  if (targetKind === constants.TEXT_STABLE) {
    targetVersion.prerelease = [];

    return targetVersion;
  }

  // Add prerelease if not stable
  targetVersion.prerelease[0] = targetKind;

  // Reset prerelease count
  targetVersion.prerelease[1] = 1;
}

function getWithoutPrerelease(tagName: string) {
  const targetVersion = semver.parse(tagName);

  if (targetVersion === null) {
    return constants.TEXT_EMPTY;
  }

  resetPrerelease(targetVersion, constants.TEXT_STABLE);

  return formatVersion(tagName, targetVersion);
}

function formatVersion(tagName: string, targetVersion: semver.SemVer) {
  // Add "v" if necessary
  if (tagName.includes(constants.VERSION_PREFIX)) {
    return `${constants.VERSION_PREFIX}${targetVersion.format()}`;
  }

  return targetVersion.format();
}

export {
  formatWithEmoji,
  getKind,
  getMajor,
  getMinor,
  getPatch,
  getPrerelease,
  getWithoutPrerelease,
};
