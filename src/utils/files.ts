import { runCommand } from "./shell.ts";

import * as constants from "../constants.ts";

async function doesFileExist(fileName: string): Promise<boolean> {
  try {
    await Deno.stat(fileName);
    return true;
  } catch (_error) {
    return false;
  }
}

async function updateVersionFiles(newTagName: string) {
  let filesUpdated = 0;

  filesUpdated += await updatePackageJsonIfExists(newTagName);
  filesUpdated += await updatePomFileIfExists(newTagName);

  return filesUpdated;
}

async function updatePackageJsonIfExists(newTagName: string) {
  let changed = 0;

  const isNode = await doesFileExist(constants.PACKAGE_JSON_FILENAME);

  if (isNode === false) {
    return changed;
  }

  changed = await updatePackageFile(newTagName);

  if (changed === 0) {
    // Windows
    changed = await updatePackageFile(newTagName, true);
  }

  return changed;
}

async function updatePackageFile(
  newTagName: string,
  useCmd = false,
) {
  let changed = 0;
  let npmCommand = constants.NPM_COMMAND;

  if (useCmd) {
    npmCommand += constants.WINDOWS_COMMAND_CMD_SUFFIX;
  }

  try {
    await runCommand(npmCommand, [
      constants.NPM_COMMAND_ARGUMENT_VERSION,
      newTagName,
      constants.NPM_COMMAND_ARGUMENT_NO_GIT_TAG_VERSION,
    ]);
    changed = 1;
  } catch (__error) {
    // Ignored
  }

  return changed;
}

async function updatePomFileIfExists(newTagName: string) {
  let changed = 0;

  const isJava = await doesFileExist(constants.POM_XML_FILENAME);

  if (isJava === false) {
    return changed;
  }

  changed = await updatePomFile(newTagName);

  if (changed === 0) {
    // Windows
    changed = await updatePomFile(newTagName, true);
  }

  return changed;
}

async function updatePomFile(newTagName: string, useCmd = false) {
  let changed = 0;
  let mvnCommand = constants.MVN_COMMAND;

  if (useCmd) {
    mvnCommand += constants.WINDOWS_COMMAND_BAT_SUFFIX;
  }

  try {
    await runCommand(mvnCommand, [
      constants.MVN_COMMAND_ARGUMENT_VERSIONS_SET,
      constants.MVN_COMMAND_ARGUMENT_D_NEW_VERSION + newTagName,
    ]);
    changed = 1;
  } catch (__error) {
    // Ignored
  }

  return changed;
}

export { updateVersionFiles };
