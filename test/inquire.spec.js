/*
Copyright 2019 Javier Brea
Copyright 2019 XbyOrange

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

const sinon = require("sinon");
const inquirer = require("inquirer");

const inquire = require("../src/inquire");

describe("inquire", () => {
  const linkablePackages = {
    "foo-package-1-name-2": {
      folder: "foo-package-1",
      dependencies: {
        "foo-1": "1.0.0",
        "foo-package-2-name": "2.0.0"
      },
      devDependencies: {
        "foo-package-3-name": "2.0.0",
        "foo-4": "4.0.0"
      },
      packageJson: {
        name: "foo-package-1-name-2",
        version: "1.0.0",
        dependencies: {
          "foo-1": "1.0.0",
          "foo-package-2-name": "2.0.0"
        },
        devDependencies: {
          "foo-package-3-name": "2.0.0",
          "foo-4": "4.0.0"
        }
      },
      isLinked: true
    }
  };
  let sandbox;
  let inquirerStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    inquirerStub = sandbox.stub(inquirer, "prompt").resolves();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("choose method", () => {
    it("should return packages selected by user in toLink property", async () => {
      expect.assertions(1);
      inquirerStub.resolves({
        packages: ["foo-package-1-name-2"]
      });

      const result = await inquire.choose(linkablePackages);
      expect(result).toEqual({
        toLink: linkablePackages,
        toUnlink: {}
      });
    });

    it("should return packages not selected by user in toUnlink property", async () => {
      expect.assertions(1);
      inquirerStub.resolves({
        packages: []
      });

      const result = await inquire.choose(linkablePackages);
      expect(result).toEqual({
        toLink: {},
        toUnlink: linkablePackages
      });
    });
  });
});
