import { colors, Confirm, Input, Select, SelectValueOptions } from "../deps.ts";
import { addExtraOptionsIfNecessary } from "./utils/options.ts";

import * as constants from "./constants.ts";
import * as git from "./utils/git.ts";
import * as version from "./utils/version.ts";
import * as files from "./utils/files.ts";

export async function start() {
  // Get status
  const { branch, staged, remote } = await git.getStatus();

  exitIfChangesUnstaged(staged);

  // Pull changes
  await pullBranchIfUpstream(remote);

  // Get tag
  const { tagName, remoteError } = await getLatestTagAndSource(remote);
  const kind = version.getKind(tagName);

  printTagName(tagName, kind, remoteError);

  // Ask kind
  const newKind = await askVersionKind(branch, kind);

  // Ask bump
  const newTagName = await askVersionBump(
    tagName,
    kind,
    newKind,
  );

  // Confirm new tag
  const tagNameConfirmed: boolean = await confirmTagName(newTagName);

  if (tagNameConfirmed === false) {
    start();
    return;
  }

  // Update version files
  await updateVersionFilesIfExists(tagName, newTagName, remoteError);

  // Create tag
  await git.createTag(newTagName);

  if (remoteError) {
    return;
  }

  // Push tag
  const tagPushConfirmed = await confirmTagPush(newTagName);

  if (tagPushConfirmed) {
    await git.pushTag();
  }
}

function exitIfChangesUnstaged(staged: boolean) {
  if (staged) {
    return;
  }

  console.error(
    colors.bold.red(constants.TEXT_ERROR_CHANGES_UNSTAGED),
  );

  Deno.exit(constants.EXIT_ERROR);
}

async function pullBranchIfUpstream(remote: boolean) {
  if (remote === false) {
    return;
  }

  let output = await git.pullBranch();
  output = output.toLowerCase();

  if (output.includes(constants.GIT_ALREADY_UP_TO_DATE)) {
    return;
  }

  console.info(
    `${constants.EMOJI_TASK} ${constants.TEXT_LOCAL_BRANCH_UPDATED}`,
  );
}

async function getLatestTagAndSource(remote: boolean) {
  const result = {
    tagName: constants.TEXT_UNKNOWN,
    remoteError: false,
  };

  if (remote) {
    try {
      const remoteTag = await git.getLatestTagFromRemote();

      result.tagName = remoteTag;

      return result;
    } catch (_error) {
      result.remoteError = true;
    }
  }

  const localTag = await git.getLatestTagFromLocal();

  result.tagName = localTag;

  return result;
}

function printTagName(
  tagName: string,
  kind: string,
  remoteError: boolean,
) {
  let local = "";

  if (remoteError) {
    local = colors.bold.yellow(constants.TEXT_LOCAL);
  }

  console.info(constants.TEXT_EMPTY);

  console.info(
    colors.bold(constants.TEXT_LATEST_TAG),
    colors.bold.blue(version.formatWithEmoji(tagName, kind)),
    local,
  );

  console.info(constants.TEXT_EMPTY);
}

async function askVersionKind(branch: string, kind: string) {
  const options: SelectValueOptions = [
    {
      name: `${constants.EMOJI_BETA} ${constants.TEXT_BETA}`,
      value: constants.TEXT_BETA,
    },
    {
      name: `${constants.EMOJI_ALPHA} ${constants.TEXT_ALPHA}`,
      value: constants.TEXT_ALPHA,
    },
    {
      name: `${constants.EMOJI_CUSTOM} ${constants.TEXT_CUSTOM}`,
      value: constants.TEXT_CUSTOM,
    },
  ];

  const isDefaultBranch = git.getDefaultBranches().includes(branch);

  if (isDefaultBranch) {
    options.unshift({
      name: `${constants.EMOJI_STABLE} ${constants.TEXT_STABLE}`,
      value: constants.TEXT_STABLE,
    });
  }

  let userKind = await Select.prompt({
    message: constants.TEXT_PICK_VERSION_KIND,
    options,
  });

  if (userKind === constants.TEXT_CUSTOM) {
    userKind = await Input.prompt({
      message: constants.TEXT_PICK_VERSION_KIND,
      suggestions: [kind],
    });
  }

  return userKind;
}

async function askVersionBump(
  tagName: string,
  kind: string,
  newKind: string,
) {
  const majorVersion = version.getMajor(tagName, newKind);
  const minorVersion = version.getMinor(tagName, newKind);
  const patchVersion = version.getPatch(tagName, newKind);

  const options: SelectValueOptions = [
    {
      name: `${constants.EMOJI_MAJOR} ${constants.TEXT_MAJOR} (${
        colors.bold.yellow(majorVersion)
      })`,
      value: majorVersion,
    },
    {
      name: `${constants.EMOJI_MINOR} ${constants.TEXT_MINOR} (${
        colors.bold.yellow(minorVersion)
      })`,
      value: minorVersion,
    },
    {
      name: `${constants.EMOJI_PATCH} ${constants.TEXT_PATCH} (${
        colors.bold.yellow(patchVersion)
      })`,
      value: patchVersion,
    },
  ];

  addExtraOptionsIfNecessary(
    options,
    tagName,
    kind,
    newKind,
  );

  return await Select.prompt({
    message: constants.TEXT_PICK_VERSION_BUMP,
    options,
  });
}

async function confirmTagName(newTagName: string) {
  const promptResponse = await Confirm.prompt(
    `${constants.TEXT_CONFIRM_TAG_NAME} ${colors.yellow(newTagName)}`,
  );

  console.info(constants.TEXT_EMPTY);

  return promptResponse;
}

async function updateVersionFilesIfExists(
  tagName: string,
  newTagName: string,
  remoteError: boolean,
) {
  // Check if changes pending
  const { staged } = await git.getStatus();
  exitIfChangesUnstaged(staged);

  newTagName = newTagName.replace(/^v/, constants.TEXT_EMPTY);

  const filesChanged = await files.updateVersionFiles(tagName, newTagName);

  if (filesChanged > 0) {
    await git.switchToNewBranch(newTagName);

    await git.prepareCommit();
    await git.createCommit(newTagName);

    if (remoteError === false) {
      await git.pushCommit(newTagName);
    }
  }
}

async function confirmTagPush(newTagName: string) {
  console.info(constants.TEXT_EMPTY);

  const promptResponse = await Confirm.prompt(
    `${constants.TEXT_CONFIRM_TAG_PUSH} ${colors.yellow(newTagName)}`,
  );

  console.info(constants.TEXT_EMPTY);

  return promptResponse;
}
