/*
Copyright 2019 Javier Brea
Copyright 2019 XbyOrange

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

"use strict";

const path = require("path");

const fsExtra = require("fs-extra");

const { FILE_DEPENDENCY, PACKAGEJSON_NAMESPACE } = require("./utils/helpers");
const { PACKAGE_LOCK, PACKAGE_JSON } = require("./utils/paths");

const ENCODING = "utf8";

const readPackageFile = fileName => {
  const filePath = path.resolve(process.cwd(), fileName);
  if (fsExtra.existsSync(filePath)) {
    return fsExtra.readFile(filePath, ENCODING);
  }
  return Promise.resolve("");
};

const isValidContent = fileContent => Promise.resolve(!fileContent.includes(FILE_DEPENDENCY));
const hasOriginalVersions = packageInfo => !!packageInfo[PACKAGEJSON_NAMESPACE];

const readPackageLock = () => readPackageFile(PACKAGE_LOCK);
const readPackageJson = () => readPackageFile(PACKAGE_JSON);
const readPackageJsonAsJson = () => fsExtra.readJson(path.resolve(process.cwd(), PACKAGE_JSON));

const avoidFileLinks = () =>
  Promise.all([
    readPackageLock().then(isValidContent),
    readPackageJson().then(isValidContent),
    readPackageJsonAsJson().then(packageInfo => Promise.resolve(!hasOriginalVersions(packageInfo)))
  ]).then(results => {
    if (results.includes(false)) {
      return Promise.reject(
        new Error('File links found. Please run "npm-file-link -ua" to remove all links')
      );
    }
  });

module.exports = {
  avoidFileLinks
};
