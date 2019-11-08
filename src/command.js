/*
Copyright 2019 Javier Brea
Copyright 2019 XbyOrange

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

const chalk = require("chalk");
const program = require("commander");
const link = require("./link");
const unlink = require("./unlink");
const check = require("./check");

const packageJson = require("../package.json");

program
  .version(packageJson.version, "-v, --version", "Output the current version")
  .option("-a, --all", "Apply command to all locally found dependencies. Do not prompt.")
  .option("-u, --unlink", "Unlink packages. Has to be used with the -a option")
  .option("-c, --check", "Throw an error if there are locally linked packages");

const run = () => {
  program.parse(process.argv);

  if (program.check) {
    return check.avoidFileLinks();
  }

  if (program.all) {
    if (program.unlink) {
      return unlink.all();
    }
    return link.all();
  }
  return link.select();
};

const runAndCatch = () => {
  return run().catch(err => {
    console.log(chalk.red(`\nERROR: ${err.message}.\n`));
    process.exitCode = 1;
    return Promise.resolve();
  });
};

module.exports = {
  runAndCatch
};
