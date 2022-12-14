import {
  colors,
  Confirm,
  Input,
  parse,
  Select,
  SelectValueOptions,
} from "../deps.ts";

import { addExtraOptionsIfNecessary } from "./utils/options.ts";

import * as constants from "./constants.ts";
import * as log from "./utils/log.ts";
import * as git from "./utils/git.ts";
import * as version from "./utils/version.ts";
import * as files from "./utils/files.ts";

export async function start() {
  // Flags
  const { "default-branch": defaultBranch } = parseFlags();

  while (true) {
    // Get status
    const { branch, staged, remote } = await git.getStatus();

    exitIfChangesUnstaged(staged);

    // Pull changes
    if (remote) {
      const ok = await pullOrCheckoutDefaultBranch(defaultBranch);

      if (ok === false) {
        continue;
      }
    }

    // Get tag
    const { tagName, local } = await getLatestTagAndSource(remote);
    const kind = version.getKind(tagName);

    printTagName(tagName, kind, local);

    // Ask kind
    const newKind = await askVersionKind(branch, kind, defaultBranch);

    // Ask bump
    const newTagName = await askVersionBump(
      tagName,
      kind,
      newKind,
    );

    // Confirm new tag
    const tagNameConfirmed = await confirmTagName(newTagName);

    if (tagNameConfirmed === false) {
      continue;
    }

    // Update version files
    const filesChanged = await updateVersionFilesIfExists(
      kind,
      tagName,
      newTagName,
      local,
    );

    if (filesChanged > 0) {
      await git.checkoutDefaultBranch(defaultBranch);

      const ok = await mergeOrPullBranch(local, newTagName);

      if (ok === false) {
        continue;
      }
    }

    // Create tag
    await git.createTag(newTagName);

    if (local) {
      return;
    }

    // Push tag
    const tagPushConfirmed = await confirmTagPush(newTagName);

    if (tagPushConfirmed) {
      await git.pushTag();
    }

    break;
  }
}

function parseFlags() {
  return parse(Deno.args, {
    string: [constants.ARG_DEFAULT_BRANCH],
    default: {
      "default-branch": null,
    },
  });
}

function exitIfChangesUnstaged(staged: boolean) {
  if (staged) {
    return;
  }

  log.error(constants.TEXT_ERROR_CHANGES_UNSTAGED);

  Deno.exit(constants.EXIT_ERROR);
}

async function pullOrCheckoutDefaultBranch(defaultBranch: string | null) {
  let ok = false;

  try {
    await git.pullBranch();
    ok = true;
  } catch (error) {
    const { message } = error;

    if (message.includes(constants.GIT_ERROR_NO_SUCH_REF_WAS_FETCHED)) {
      log.warn(constants.TEXT_REMOTE_BRANCH_NOT_FOUND);
      await git.checkoutDefaultBranch(defaultBranch);
      return ok;
    }

    log.error(error.message);
  }

  return ok;
}

async function getLatestTagAndSource(remote: boolean) {
  const result = {
    tagName: constants.TEXT_UNKNOWN,
    local: true,
  };

  if (remote) {
    try {
      const remoteTag = await git.getLatestTagFromRemote();

      result.tagName = remoteTag;
      result.local = false;

      return result;
    } catch (_error) {
      result.local = true;
    }
  }

  const localTag = await git.getLatestTagFromLocal();
  result.tagName = localTag;

  return result;
}

function printTagName(
  tagName: string,
  kind: string,
  local: boolean,
) {
  let localText = "";

  if (local) {
    localText = colors.bold.yellow(constants.TEXT_LOCAL);
  }

  console.info(constants.TEXT_EMPTY);

  console.info(
    colors.bold(constants.TEXT_LATEST_TAG),
    colors.bold.blue(version.formatWithEmoji(tagName, kind)),
    localText,
  );

  console.info(constants.TEXT_EMPTY);
}

async function askVersionKind(
  branch: string,
  kind: string,
  defaultBranch: string | null,
) {
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

  const isDefaultBranch = git.isDefaultBranch(branch, defaultBranch);

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
  kind: string,
  tagName: string,
  newTagName: string,
  local: boolean,
) {
  // Check if changes pending
  const { staged } = await git.getStatus();
  exitIfChangesUnstaged(staged);

  newTagName = newTagName.replace(/^v/, constants.TEXT_EMPTY);

  const filesChanged = await files.updateVersionFiles(
    kind,
    tagName,
    newTagName,
  );

  if (filesChanged === 0) {
    return filesChanged;
  }

  await git.switchToNewBranch(newTagName);
  log.task(constants.TEXT_VERSION_BRANCH_CREATED);

  await git.prepareCommit();
  await git.createCommit(newTagName);
  log.task(constants.TEXT_VERSION_BRANCH_COMMITTED);

  if (local === false) {
    await git.pushCommit(newTagName);
    log.task(constants.TEXT_VERSION_BRANCH_PUSHED);
  }

  return filesChanged;
}

async function mergeOrPullBranch(
  local: boolean,
  newTagName: string,
) {
  let ok = false;

  if (local) {
    await git.squashBranch(newTagName);
    await git.prepareCommit();
    await git.createCommit(newTagName);

    log.task(constants.TEXT_VERSION_BRANCH_SQUASHED);

    return true;
  }

  log.warn(constants.TEXT_MERGE_BRANCH_BEFORE_TAG_CREATION);
  console.info(constants.TEXT_EMPTY);

  ok = await Confirm.prompt(
    constants.TEXT_CONFIRM_TAG_CREATION,
  );

  console.info(constants.TEXT_EMPTY);

  if (ok) {
    try {
      await git.pullBranch();
    } catch (error) {
      const { message } = error;
      log.error(message);
    }
  }

  return ok;
}

async function confirmTagPush(newTagName: string) {
  console.info(constants.TEXT_EMPTY);

  const promptResponse = await Confirm.prompt(
    `${constants.TEXT_CONFIRM_TAG_PUSH} ${colors.yellow(newTagName)}`,
  );

  console.info(constants.TEXT_EMPTY);

  return promptResponse;
}
