/*
Copyright 2019 Javier Brea
Copyright 2019 XbyOrange

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

"use strict";

const path = require("path");
const childProcess = require("child_process");
const chalk = require("chalk");

const fsExtra = require("fs-extra");

const UTF8 = "utf8";

const logger = data => {
  console.log(data);
};

const removeNodeModules = () => {
  console.log(chalk.yellow("Removing node_modules folder..."));
  return fsExtra.remove(path.resolve(process.cwd(), "node_modules"));
};

const install = retrying => {
  return new Promise((resolve, reject) => {
    console.log("Reinstalling npm dependencies...");
    const installProcess = childProcess.spawn("npm", ["i"], {
      windowsHide: true,
      shell: true,
      env: {
        ...process.env,
        FORCE_COLOR: true
      }
    });

    installProcess.stdout.setEncoding(UTF8);
    installProcess.stderr.setEncoding(UTF8);

    installProcess.stdout.on("data", logger);
    installProcess.stderr.on("data", logger);

    installProcess.on("close", code => {
      if (code !== 0) {
        if (!retrying) {
          return removeNodeModules()
            .then(() => install(true))
            .then(() => {
              resolve();
            })
            .catch(err => {
              reject(err);
            });
        } else {
          reject(new Error("Error installing dependencies"));
        }
      } else {
        resolve();
      }
    });
  });
};

const checkChangesAndInstall = modified => {
  if (modified > 0) {
    return install();
  }
  console.log(chalk.green("No changes detected. Skipping install."));
  return Promise.resolve();
};

module.exports = {
  checkChangesAndInstall
};
