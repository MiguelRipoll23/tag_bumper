import * as constants from "../constants.ts";
import * as log from "../utils/log.ts";

import { printErrorMessage, runCommand } from "./shell.ts";

async function getStatus() {
  const { code, output, errorOutput } = await runCommand(
    constants.GIT_COMMAND,
    [
      constants.GIT_COMMAND_ARGUMENT_STATUS,
      constants.GIT_COMMAND_ARGUMENT_UNTRACKED_FILES_NO,
    ],
  );

  if (code !== 0) {
    printErrorMessage(output, errorOutput);
    Deno.exit(constants.EXIT_ERROR);
  }

  // Branch
  let branch = constants.TEXT_UNKNOWN;
  const branchIndex = output.indexOf(constants.GIT_ON_BRANCH);

  if (branchIndex > -1) {
    const lineBreakIndex = output.indexOf(constants.TEXT_NEW_LINE, branchIndex);
    branch = output.substring(constants.GIT_ON_BRANCH.length, lineBreakIndex);
  }

  // Staged
  let staged = false;

  if (output.includes(constants.GIT_CHANGES_NOT_STAGED) == false) {
    staged = true;
  }

  // Remote
  let remote = false;

  if (output.includes(constants.GIT_ORIGIN)) {
    remote = true;
  }

  return {
    branch,
    staged,
    remote,
  };
}

async function pullBranch() {
  const { code, output, errorOutput } = await runCommand(
    constants.GIT_COMMAND,
    [
      constants.GIT_COMMAND_ARGUMENT_PULL,
      constants.GIT_COMMAND_ARGUMENT_VERBOSE,
    ],
  );

  if (code === 0) {
    return output.trim();
  }

  throw new Error(errorOutput);
}

async function checkoutDefaultBranch(defaultBranch: string | null) {
  const branchName = getDefaultBranch(defaultBranch);

  const { code, output, errorOutput } = await runCommand(
    constants.GIT_COMMAND,
    [
      constants.GIT_COMMAND_ARGUMENT_CHECKOUT,
      branchName,
    ],
  );

  if (code === 0) {
    return;
  }

  if (errorOutput.includes(constants.GIT_ERROR_NO_MATCH_KNOWN)) {
    log.error(constants.TEXT_LOCAL_BRANCH_NOT_FOUND);
    Deno.exit(constants.EXIT_ERROR);
  }

  printErrorMessage(output, errorOutput);
  Deno.exit(constants.EXIT_ERROR);
}

async function getLatestTagFromRemote() {
  const { code, output, errorOutput } = await runCommand(
    constants.GIT_COMMAND,
    [
      constants.GIT_COMMAND_ARGUMENT_LS_REMOTE,
      constants.GIT_COMMAND_ARGUMENT_TAGS,
      constants.GIT_COMMAND_ARGUMENT_SORT_DESC_V_REFNAME,
      constants.GIT_COMMAND_ARGUMENT_ORIGIN,
    ],
  );

  if (code !== 0) {
    throw new Error(errorOutput);
  }

  if (output.length === 0) {
    throw new Error(constants.TEXT_ERROR_NO_TAGS_FOUND);
  }

  // Parse tag
  const outputLines = output.split(constants.TEXT_NEW_LINE);
  const outputLine = outputLines[0];
  const [_sha, ref] = outputLine.split(constants.TEXT_TAB);

  let tag = ref.replace(constants.GIT_TAGS_PREFIX, constants.TEXT_EMPTY);

  tag = tag.replace(
    constants.GIT_TAGS_SUFFIX,
    constants.TEXT_EMPTY,
  );

  return tag;
}

async function getLatestTagFromLocal() {
  const { code, output, errorOutput } = await runCommand(
    constants.GIT_COMMAND,
    [
      constants.GIT_COMMAND_ARGUMENT_DESCRIBE,
      constants.GIT_COMMAND_ARGUMENT_TAGS,
      constants.GIT_COMMAND_ARGUMENT_ABBREV_0,
    ],
  );

  if (code === 0) {
    return output.trim();
  }

  const errorMessage = code === 1 ? output : errorOutput;

  if (
    errorMessage.includes(
      constants.GIT_ERROR_NO_NAMES_FOUND_CANNOT_DESCRIBE_ANYTHING,
    )
  ) {
    return constants.GIT_INITIAL_TAG_NAME;
  }

  printErrorMessage(output, errorOutput);
  Deno.exit(constants.EXIT_ERROR);
}

function getDefaultBranch(defaultBranch: string | null) {
  if (defaultBranch === null) {
    return constants.GIT_MAIN;
  }

  return defaultBranch;
}

function isDefaultBranch(branch: string, defaultBranch: string | null) {
  if (defaultBranch === null) {
    return branch === constants.GIT_MAIN;
  }

  return branch === defaultBranch;
}

async function switchToNewBranch(tagName: string) {
  const { code, output, errorOutput } = await runCommand(
    constants.GIT_COMMAND,
    [
      constants.GIT_COMMAND_ARGUMENT_SWITCH,
      constants.GIT_COMMAND_ARGUMENT_FORCE_CREATE,
      constants.VERSION_PREFIX + tagName,
    ],
  );

  if (code === 0) {
    return;
  }

  printErrorMessage(output, errorOutput);
  Deno.exit(constants.EXIT_ERROR);
}

async function squashBranch(tagName: string) {
  const { code, output, errorOutput } = await runCommand(
    constants.GIT_COMMAND,
    [
      constants.GIT_COMMAND_ARGUMENT_MERGE,
      constants.GIT_COMMAND_ARGUMENT_SQUASH,
      constants.VERSION_PREFIX + tagName,
    ],
  );

  if (code === 0) {
    return;
  }

  printErrorMessage(output, errorOutput);
  Deno.exit(constants.EXIT_ERROR);
}

async function prepareCommit() {
  const { code, output, errorOutput } = await runCommand(
    constants.GIT_COMMAND,
    [
      constants.GIT_COMMAND_ARGUMENT_ADD,
      constants.GIT_COMMAND_ARGUMENT_ADD_FILENAMES,
    ],
  );

  if (code === 0) {
    return;
  }

  printErrorMessage(output, errorOutput);
  Deno.exit(constants.EXIT_ERROR);
}

async function createCommit(tagName: string) {
  const { code, output, errorOutput } = await runCommand(
    constants.GIT_COMMAND,
    [
      constants.GIT_COMMAND_ARGUMENT_COMMIT,
      constants.GIT_COMMAND_ARGUMENT_MESSAGE,
      constants.VERSION_PREFIX + tagName,
    ],
  );

  if (code === 0) {
    return;
  }

  printErrorMessage(output, errorOutput);
  Deno.exit(constants.EXIT_ERROR);
}

async function pushCommit(tagName: string) {
  const { code, output, errorOutput } = await runCommand(
    constants.GIT_COMMAND,
    [
      constants.GIT_COMMAND_ARGUMENT_PUSH,
      constants.GIT_COMMAND_ARGUMENT_SET_UPSTREAM,
      constants.GIT_COMMAND_ARGUMENT_ORIGIN,
      constants.VERSION_PREFIX + tagName,
    ],
  );

  if (code === 0) {
    return;
  }

  printErrorMessage(output, errorOutput);
  Deno.exit(constants.EXIT_ERROR);
}

async function createTag(tagName: string) {
  const { code, output, errorOutput } = await runCommand(
    constants.GIT_COMMAND,
    [
      constants.GIT_COMMAND_ARGUMENT_TAG,
      tagName,
    ],
  );

  if (code === 0) {
    log.task(constants.TEXT_TAG_CREATED);
    return;
  }

  printErrorMessage(output, errorOutput);
  Deno.exit(constants.EXIT_ERROR);
}

async function pushTag() {
  const { code, output, errorOutput } = await runCommand(
    constants.GIT_COMMAND,
    [
      constants.GIT_COMMAND_ARGUMENT_PUSH,
      constants.GIT_COMMAND_ARGUMENT_TAGS,
      constants.GIT_COMMAND_ARGUMENT_ORIGIN,
    ],
  );

  if (code === 0) {
    log.task(constants.TEXT_TAG_PUSHED);
    return;
  }

  printErrorMessage(output, errorOutput);
}

export {
  checkoutDefaultBranch,
  createCommit,
  createTag,
  getLatestTagFromLocal,
  getLatestTagFromRemote,
  getStatus,
  isDefaultBranch,
  prepareCommit,
  pullBranch,
  pushCommit,
  pushTag,
  squashBranch,
  switchToNewBranch,
};
