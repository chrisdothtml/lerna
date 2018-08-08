"use strict";

const log = require("npmlog");

module.exports = getExecOpts;

function getExecOpts(pkg, registry, otp) {
  // execa automatically extends process.env
  const env = {};

  if (registry) {
    env.npm_config_registry = registry;
  }

  if (otp) {
    env.npm_config_otp = otp;
  }

  log.silly("getExecOpts", pkg.location, registry, otp);
  return {
    cwd: pkg.location,
    env,
    pkg,
  };
}
