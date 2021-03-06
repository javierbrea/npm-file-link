/*
Copyright 2019 Javier Brea
Copyright 2019 XbyOrange

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

"use strict";

const chalk = require("chalk");

const unlink = require("./unlink");
const inquire = require("./inquire");
const packages = require("./utils/packages");
const npm = require("./npm");
const { FILE_DEPENDENCY, PACKAGEJSON_NAMESPACE, isFileDependency } = require("./utils/helpers");

const logAdd = (dependency, packageName) => {
  console.log(chalk.green(`Linking \"${dependency}\" in \"${packageName}\"`));
};

const addOriginalVersion = (packageInfo, packageName, original_version) => {
  packageInfo[PACKAGEJSON_NAMESPACE] = packageInfo[PACKAGEJSON_NAMESPACE] || {
    original_versions: {}
  };
  packageInfo[PACKAGEJSON_NAMESPACE].original_versions[packageName] = original_version;
};

const addPackagesLinks = (packageInfo, allPackages) => {
  let modified = false;
  let totalModified = 0;

  Object.keys(allPackages).forEach(packageName => {
    if (
      packageInfo.dependencies[packageName] &&
      !isFileDependency(packageInfo.dependencies[packageName])
    ) {
      addOriginalVersion(
        packageInfo.packageJson,
        packageName,
        packageInfo.dependencies[packageName]
      );
      packageInfo.dependencies[
        packageName
      ] = `${FILE_DEPENDENCY}${allPackages[packageName].folder}`;

      logAdd(packageName, packageInfo.packageJson.name);
      totalModified++;
      modified = true;
    }
    if (
      packageInfo.devDependencies[packageName] &&
      !isFileDependency(packageInfo.devDependencies[packageName])
    ) {
      addOriginalVersion(
        packageInfo.packageJson,
        packageName,
        packageInfo.devDependencies[packageName]
      );
      packageInfo.devDependencies[
        packageName
      ] = `${FILE_DEPENDENCY}${allPackages[packageName].folder}`;
      logAdd(packageName, packageInfo.packageJson.name);
      totalModified++;
      modified = true;
    }
  });
  if (!modified) {
    return Promise.resolve(totalModified);
  }
  const newPackageJson = {
    ...packageInfo.packageJson
  };
  if (newPackageJson.dependencies) {
    newPackageJson.dependencies = packageInfo.dependencies;
    newPackageJson[PACKAGEJSON_NAMESPACE] = packageInfo.packageJson[PACKAGEJSON_NAMESPACE];
  }
  if (newPackageJson.devDependencies) {
    newPackageJson.devDependencies = packageInfo.devDependencies;
    newPackageJson[PACKAGEJSON_NAMESPACE] = packageInfo.packageJson[PACKAGEJSON_NAMESPACE];
  }
  return packages
    .writePackageJson(packageInfo.folder, newPackageJson)
    .then(() => Promise.resolve(totalModified));
};

const all = () => {
  return packages.readCurrent().then(currentPackageInfo => {
    return packages.currentLinkablePackages(currentPackageInfo).then(linkablePackages => {
      return addPackagesLinks(currentPackageInfo, linkablePackages).then(added => {
        return npm.checkChangesAndInstall(added);
      });
    });
  });
};

const select = () => {
  return packages.readCurrent().then(currentPackageInfo => {
    return packages.currentLinkablePackages(currentPackageInfo).then(linkablePackages => {
      return inquire.choose(linkablePackages).then(chosenPackages => {
        return addPackagesLinks(currentPackageInfo, chosenPackages.toLink).then(added => {
          return unlink
            .removePackagesLinks(currentPackageInfo, chosenPackages.toUnlink)
            .then(removed => {
              return npm.checkChangesAndInstall(added + removed);
            });
        });
      });
    });
  });
};

module.exports = {
  all,
  select
};
