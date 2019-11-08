/*
Copyright 2019 Javier Brea
Copyright 2019 XbyOrange

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

"use strict";

const fs = require("fs");
const path = require("path");

const PACKAGE_JSON = "package.json";
const PACKAGE_LOCK = "package-lock.json";

const getCurrentPath = () => Promise.resolve(process.cwd());

const isPackageFolder = folder =>
  Promise.resolve(fs.existsSync(path.resolve(folder, PACKAGE_JSON)));

const getWorkingPath = () => {
  return getCurrentPath().then(currentPath => {
    return isPackageFolder(currentPath).then(isPackage => {
      if (isPackage) {
        return Promise.resolve(path.resolve(currentPath, ".."));
      }
      return Promise.resolve(currentPath);
    });
  });
};

module.exports = {
  PACKAGE_JSON,
  PACKAGE_LOCK,
  getWorkingPath,
  isPackageFolder
};
