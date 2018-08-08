"use strict";

const log = require("npmlog");
const childProcess = require("@lerna/child-process");
const getExecOpts = require("@lerna/get-npm-exec-opts");
const ValidationError = require("@lerna/validation-error");

module.exports = getTwoFactorAuthRequired;

function getTwoFactorAuthRequired(location, { registry }) {
  log.silly("getTwoFactorAuthRequired");

  const args = [
    "profile",
    "get",
    // next parameter is _not_ a typo...
    "two-factor auth",
    // immediate feedback from request errors, not excruciatingly slow retries
    // @see https://docs.npmjs.com/misc/config#fetch-retries
    "--fetch-retries=0",
    // including http requests makes raw logging easier to debug for end users
    "--loglevel=http",
  ];
  const opts = getExecOpts({ location }, registry);

  // we do not need special log handling
  delete opts.pkg;

  return childProcess.exec("npm", args, opts).then(
    result => result.stdout === "auth-and-writes",
    ({ stderr }) => {
      // Log the error cleanly to stderr, it already has npmlog decorations
      log.pause();
      console.error(stderr); // eslint-disable-line no-console
      log.resume();

      throw new ValidationError("ETWOFACTOR", "Unable to obtain two-factor auth mode");
    }
  );
}
