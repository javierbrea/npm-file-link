/*
Copyright 2019 Javier Brea
Copyright 2019 XbyOrange

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

"use strict";

const inquirer = require("inquirer");

const getPackagesChoices = packages => {
  const choices = [];
  Object.keys(packages).forEach(packageName => {
    choices.push({
      name: packageName,
      value: packageName,
      checked: packages[packageName].isLinked
    });
  });
  return choices;
};

const choose = packages => {
  const packagesChoices = getPackagesChoices(packages);
  return inquirer
    .prompt([
      {
        name: "packages",
        type: "checkbox",
        message: "Choose packages to link",
        pageSize: 10,
        choices: packagesChoices
      }
    ])
    .then(answers => {
      const toLink = {};
      const toUnlink = {};
      Object.keys(packages).forEach(packageName => {
        if (answers.packages.includes(packageName)) {
          toLink[packageName] = packages[packageName];
        } else {
          toUnlink[packageName] = packages[packageName];
        }
      });
      return {
        toLink,
        toUnlink
      };
    });
};

module.exports = {
  choose
};
