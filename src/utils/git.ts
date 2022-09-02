import * as constants from "../constants.ts";

import { colors } from "../../deps.ts";
import { runCommand } from "./shell.ts";

async function getStatus() {
  const { code, output, errorOutput } = await runCommand(
    constants.GIT_COMMAND,
    [
      constants.GIT_COMMAND_ARGUMENT_STATUS,
      constants.GIT_COMMAND_ARGUMENT_UNTRACKED_FILES_NO,
    ],
  );

  if (code !== 0) {
    throw new Error(errorOutput);
  }

  // Branch
  let branch = constants.TEXT_UNKNOWN;
  let branchIndex = output.indexOf(constants.GIT_ON_BRANCH);

  if (branchIndex > -1) {
    const lineBreakIndex = output.indexOf("\n", branchIndex);
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

  // Updated
  let updated = false;

  if (remote === false || output.includes(constants.GIT_BRANCH_UP_TO_DATE)) {
    updated = true;
  }

  return {
    branch,
    staged,
    remote,
    updated,
  };
}

function getDefaultBranches() {
  const defaultBranches = [
    constants.GIT_MAIN,
    constants.GIT_MASTER,
  ];

  const envDefaultBranches = Deno.env.get(constants.ENV_DEFAULT_BRANCHES);

  if (envDefaultBranches === undefined) {
    return defaultBranches;
  }

  const extraDefaultBranches = envDefaultBranches.split(constants.TEXT_COMMA);

  return defaultBranches.concat(extraDefaultBranches);
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

  const outputLines = output.split("\n");

  for (const outputLine of outputLines) {
    const [sha, ref] = outputLine.split("\t");

    if (sha === undefined || ref === undefined) {
      continue;
    }

    if (ref.startsWith(constants.GIT_TAGS_PREFIX) === false) {
      continue;
    }

    let tag = ref.replace(constants.GIT_TAGS_PREFIX, constants.TEXT_EMPTY);

    tag = tag.replace(
      constants.GIT_TAGS_SUFFIX,
      constants.TEXT_EMPTY,
    );

    return tag;
  }

  throw new Error(constants.TEXT_ERROR_NO_TAGS_FOUND);
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

  if (
    errorOutput.includes(
      constants.GIT_ERROR_NO_NAMES_FOUND_CANNOT_DESCRIBE_ANYTHING,
    )
  ) {
    return constants.GIT_INITIAL_TAG_NAME;
  }

  console.error(`${constants.EMOJI_ERROR} ${colors.bold.red(errorOutput)}`);
  Deno.exit(1);
}

async function switchToNewBranch(tagName: string) {
  const { code, errorOutput } = await runCommand(constants.GIT_COMMAND, [
    constants.GIT_COMMAND_ARGUMENT_SWITCH,
    constants.GIT_COMMAND_ARGUMENT_CREATE,
    constants.VERSION_PREFIX + tagName,
  ]);

  if (code === 0) {
    return;
  }

  console.error(`${constants.EMOJI_ERROR} ${colors.bold.red(errorOutput)}`);
  Deno.exit(constants.EXIT_ERROR);
}

async function prepareCommit() {
  const { code, errorOutput } = await runCommand(constants.GIT_COMMAND, [
    constants.GIT_COMMAND_ARGUMENT_ADD,
    constants.GIT_COMMAND_ARGUMENT_ADD_FILENAMES,
  ]);

  if (code === 0) {
    return;
  }

  console.error(`${constants.EMOJI_ERROR} ${colors.bold.red(errorOutput)}`);
  Deno.exit(constants.EXIT_ERROR);
}

async function createCommit(targetVersion: string) {
  const { code, errorOutput } = await runCommand(constants.GIT_COMMAND, [
    constants.GIT_COMMAND_ARGUMENT_COMMIT,
    constants.GIT_COMMAND_ARGUMENT_MESSAGE,
    constants.VERSION_PREFIX + targetVersion,
  ]);

  if (code === 0) {
    return;
  }

  console.error(`${constants.EMOJI_ERROR} ${colors.bold.red(errorOutput)}`);
  Deno.exit(constants.EXIT_ERROR);
}

async function pushCommit(tagName: string) {
  const { code, errorOutput } = await runCommand(constants.GIT_COMMAND, [
    constants.GIT_COMMAND_ARGUMENT_PUSH,
    constants.GIT_COMMAND_ARGUMENT_SET_UPSTREAM,
    constants.GIT_COMMAND_ARGUMENT_ORIGIN,
    constants.VERSION_PREFIX + tagName,
  ]);

  if (code === 0) {
    return;
  }

  console.error(`${constants.EMOJI_ERROR} ${colors.bold.red(errorOutput)}`);
  Deno.exit(constants.EXIT_ERROR);
}

async function createTag(tagName: string) {
  const { code, errorOutput } = await runCommand(
    constants.GIT_COMMAND,
    [
      constants.GIT_COMMAND_ARGUMENT_TAG,
      tagName,
    ],
  );

  if (code === 0) {
    return;
  }

  console.error(`${constants.EMOJI_ERROR} ${colors.bold.red(errorOutput)}`);
  Deno.exit(constants.EXIT_ERROR);
}

async function pushTag() {
  const { code, errorOutput } = await runCommand(constants.GIT_COMMAND, [
    constants.GIT_COMMAND_ARGUMENT_PUSH,
    constants.GIT_COMMAND_ARGUMENT_TAGS,
    constants.GIT_COMMAND_ARGUMENT_ORIGIN,
  ]);

  if (code === 0) {
    return;
  }

  console.error(`${constants.EMOJI_ERROR} ${colors.bold.red(errorOutput)}`);
}

export {
  createCommit,
  createTag,
  getDefaultBranches,
  getLatestTagFromLocal,
  getLatestTagFromRemote,
  getStatus,
  prepareCommit,
  pushCommit,
  pushTag,
  switchToNewBranch,
};
