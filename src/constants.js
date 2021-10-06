'use strict';

const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;
const MAX_ID_LENGTH = 6;
const MAX_COMMENTS = 4;
const API_PREFIX = `/api`;
const ExitCode = {
  success: 0,
  error: 1
};
const DEVELOPMENT = `development`;
const PRODUCTION = `production`;

module.exports = {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  ExitCode,
  MAX_ID_LENGTH,
  MAX_COMMENTS,
  API_PREFIX,
};

module.exports.Env = {
  DEVELOPMENT,
  PRODUCTION
};
