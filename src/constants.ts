// Exit codes
export const EXIT_ERROR = -1;
export const EXIT_SUCCESS = 0;

// Configuration
export const ARG_DEFAULT_BRANCH = "default-branch";

// Git
export const GIT_MAIN = "main";
export const GIT_INITIAL_TAG_NAME = "0.0.1-alpha.0";
export const GIT_TAGS_PREFIX = "refs/tags/";
export const GIT_TAGS_SUFFIX = "^{}";
export const GIT_CHANGES_NOT_STAGED = "Changes not staged for commit";
export const GIT_ALREADY_UP_TO_DATE = "already up to date";
export const GIT_ORIGIN = "origin";
export const GIT_ERROR_NO_SUCH_REF_WAS_FETCHED = "no such ref was fetched";
export const GIT_ERROR_NO_MATCH_KNOWN =
  "did not match any file(s) known to git";
export const GIT_ERROR_NO_NAMES_FOUND_CANNOT_DESCRIBE_ANYTHING =
  "fatal: No names found, cannot describe anything.";

export const GIT_COMMAND = "git";

export const GIT_COMMAND_ARGUMENT_STATUS = "status";
export const GIT_COMMAND_ARGUMENT_UNTRACKED_FILES_NO = "--untracked-files=no";

export const GIT_COMMAND_ARGUMENT_PULL = "pull";
export const GIT_COMMAND_ARGUMENT_VERBOSE = "--verbose";
export const GIT_COMMAND_ARGUMENT_CHECKOUT = "checkout";

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
export const GIT_COMMAND_ARGUMENT_FORCE_CREATE = "--force-create";

export const GIT_COMMAND_ARGUMENT_MERGE = "merge";
export const GIT_COMMAND_ARGUMENT_SQUASH = "--squash";
export const GIT_COMMAND_ARGUMENT_COMMIT = "commit";
export const GIT_COMMAND_ARGUMENT_MESSAGE = "--message";
export const GIT_COMMAND_ARGUMENT_TAG = "tag";

export const GIT_COMMAND_ARGUMENT_PUSH = "push";
export const GIT_COMMAND_ARGUMENT_SET_UPSTREAM = "--set-upstream";

// Version
export const VERSION_PREFIX = "v";
export const VERSION_TS_FILENAME = "version.ts";
export const PACKAGE_JSON_FILENAME = "package.json";
export const POM_XML_FILENAME = "pom.xml";
export const POM_SNAPSHOT = "SNAPSHOT";
export const POM_RELEASE = "RELEASE";

export const NPM_COMMAND = "npm";

export const NPM_COMMAND_ARGUMENT_VERSION = "version";
export const NPM_COMMAND_ARGUMENT_NO_GIT_TAG_VERSION = "--no-git-tag-version";

export const MVN_COMMAND = "mvn";

export const MVN_COMMAND_ARGUMENT_VERSIONS_SET = "versions:set";
export const MVN_COMMAND_ARGUMENT_D_NEW_VERSION = "-DnewVersion=";

export const WINDOWS_COMMAND_CMD_SUFFIX = ".cmd";
export const WINDOWS_COMMAND_BAT_SUFFIX = ".bat";

// Emoji
export const EMOJI_TASK = "🟢";
export const EMOJI_INFORMATION = "🟣";
export const EMOJI_WARNING = "🟡";
export const EMOJI_ERROR = "🔴";
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
export const TEXT_COMMA = ",";
export const TEXT_TAB = "\t";
export const TEXT_NEW_LINE = "\n";
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
export const TEXT_CONFIRM_TAG_CREATION = "Confirm tag creation";
export const TEXT_CONFIRM_TAG_PUSH = "Confirm tag push";

export const TEXT_LOCAL_BRANCH_NOT_FOUND = "local branch not found";
export const TEXT_REMOTE_BRANCH_NOT_FOUND = "remote branch not found";
export const TEXT_LOCAL_BRANCH_UPDATED = "updated local branch";

export const TEXT_VERSION_FILE_UPDATED = "updated version file";
export const TEXT_VERSION_BRANCH_CREATED = "created version branch";
export const TEXT_VERSION_BRANCH_COMMITTED = "committed version branch";
export const TEXT_VERSION_BRANCH_PUSHED = "pushed version branch";
export const TEXT_VERSION_BRANCH_SQUASHED = "squashed version branch";
export const TEXT_CHANGED_CURRENT_BRANCH = "changed current branch";
export const TEXT_MERGE_BRANCH_BEFORE_TAG_CREATION =
  "merge branch before tag creation";
export const TEXT_TAG_CREATED = "created tag";
export const TEXT_TAG_PUSHED = "pushed tag";
export const TEXT_ERROR_NO_TAGS_FOUND = "no tags found";
export const TEXT_ERROR_CHANGES_UNSTAGED =
  "changes unstaged, commit your local changes";
