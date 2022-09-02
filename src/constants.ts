// Exit codes
export const EXIT_ERROR = -1;

// Configuration
export const ENV_DEFAULT_BRANCHES = "DEFAULT_BRANCHES";

// Git
export const GIT_INITIAL_TAG_NAME = "0.0.1-alpha.0";

export const GIT_MAIN = "main";
export const GIT_MASTER = "master";

export const GIT_COMMAND = "git";
export const GIT_COMMAND_ARGUMENT_STATUS = "status";

export const GIT_COMMAND_ARGUMENT_UNTRACKED_FILES_NO = "--untracked-files=no";

export const GIT_COMMAND_ARGUMENT_LS_REMOTE = "ls-remote";
export const GIT_COMMAND_ARGUMENT_SORT_DESC_V_REFNAME = "--sort=-v:refname";
export const GIT_COMMAND_ARGUMENT_ORIGIN = "origin";
export const GIT_ON_BRANCH = "On branch ";

export const GIT_COMMAND_ARGUMENT_DESCRIBE = "describe";
export const GIT_COMMAND_ARGUMENT_TAGS = "--tags";
export const GIT_COMMAND_ARGUMENT_ABBREV_0 = "--abbrev=0";
export const GIT_COMMAND_ARGUMENT_ADD = "add";
export const GIT_COMMAND_ARGUMENT_ADD_FILENAMES = ".";

export const GIT_COMMAND_ARGUMENT_SWITCH = "switch";
export const GIT_COMMAND_ARGUMENT_CREATE = "--create";

export const GIT_COMMAND_ARGUMENT_COMMIT = "commit";
export const GIT_COMMAND_ARGUMENT_MESSAGE = "--message";
export const GIT_COMMAND_ARGUMENT_TAG = "tag";

export const GIT_COMMAND_ARGUMENT_PUSH = "push";
export const GIT_COMMAND_ARGUMENT_SET_UPSTREAM = "--set-upstream";

export const GIT_TAGS_PREFIX = "refs/tags/";
export const GIT_TAGS_SUFFIX = "^{}";

export const GIT_CHANGES_NOT_STAGED = "Changes not staged for commit";
export const GIT_ORIGIN = "origin";
export const GIT_BRANCH_UP_TO_DATE = "branch is up to date";
export const GIT_ERROR_NO_NAMES_FOUND_CANNOT_DESCRIBE_ANYTHING =
  "fatal: No names found, cannot describe anything.";

// Version
export const VERSION_PREFIX = "v";

export const PACKAGE_JSON_FILENAME = "package.json";
export const POM_XML_FILENAME = "pom.xml";

export const NPM_COMMAND = "npm";
export const NPM_COMMAND_ARGUMENT_VERSION = "version";
export const NPM_COMMAND_ARGUMENT_NO_GIT_TAG_VERSION = "--no-git-tag-version";

export const MVN_COMMAND = "mvn";
export const MVN_COMMAND_ARGUMENT_VERSIONS_SET = "versions:set";
export const MVN_COMMAND_ARGUMENT_D_NEW_VERSION = "-DnewVersion=";

export const WINDOWS_COMMAND_CMD_SUFFIX = ".cmd";
export const WINDOWS_COMMAND_BAT_SUFFIX = ".bat";

// Emoji
export const EMOJI_ERROR = "❗";
export const EMOJI_SHELL = "🐚";
export const EMOJI_UNKNOWN = "🔨";
export const EMOJI_STABLE = "🚀";
export const EMOJI_BETA = "🧪";
export const EMOJI_ALPHA = "🚧";
export const EMOJI_CUSTOM = "🔮";
export const EMOJI_NONE = "🎈";
export const EMOJI_PRERELEASE = "✨";
export const EMOJI_MAJOR = "💥";
export const EMOJI_MINOR = "🎉";
export const EMOJI_PATCH = "🐛";

// Text
export const TEXT_EMPTY = "";
export const TEXT_WHITESPACE = " ";
export const TEXT_COMMA = ",";
export const TEXT_UNKNOWN = "unknown";
export const TEXT_LOCAL = "(local)";
export const TEXT_LATEST_TAG = "Latest tag:";
export const TEXT_PICK_VERSION_KIND = "Pick version kind";
export const TEXT_STABLE = "stable";
export const TEXT_BETA = "beta";
export const TEXT_ALPHA = "alpha";
export const TEXT_CUSTOM = "<custom>";
export const TEXT_PICK_VERSION_BUMP = "Pick version bump";
export const TEXT_PRERELEASE = "prerelease";
export const TEXT_NONE = "none";
export const TEXT_MAJOR = "major";
export const TEXT_MINOR = "minor";
export const TEXT_PATCH = "patch";
export const TEXT_CONFIRM_TAG_NAME = "Confirm tag name";

export const TEXT_CONFIRM_TAG_PUSH = "Confirm tag push";

export const TEXT_ERROR_NO_TAGS_FOUND = "No tags found";

export const TEXT_ERROR_CHANGES_UNSTAGED =
  "Changes unstaged, commit your local changes";

export const TEXT_ERROR_BRANCH_OUTDATED =
  "Branch outdated, update your current branch";
