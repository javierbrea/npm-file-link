/*
Copyright 2019 Javier Brea
Copyright 2019 XbyOrange

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

const path = require("path");
const fsExtra = require("fs-extra");

const sinon = require("sinon");

const packageInfo = require("../../package.json");
const paths = require("../../src/utils/paths");
const packages = require("../../src/utils/packages");

describe("packages", () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(paths, "getWorkingPath").resolves(path.resolve(__dirname, "..", "fixtures"));
    sandbox.stub(fsExtra, "writeJson").resolves();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("readAll method", () => {
    it("should return all packages info", async () => {
      const packagesInfo = await packages.readAll();
      expect(packagesInfo).toEqual({
        "foo-linked-package-name": {
          folder: "foo-linked-package",
          dependencies: {
            "foo-package-1-name": "file:../foo-package-1"
          },
          devDependencies: {},
          packageJson: {
            name: "foo-linked-package-name",
            version: "1.0.0",
            dependencies: {
              "foo-package-1-name": "file:../foo-package-1"
            }
          }
        },
        "foo-only-dev": {
          folder: "foo-only-deps",
          dependencies: {},
          devDependencies: {
            "foo-package-1-name": "1.1.1"
          },
          packageJson: {
            name: "foo-only-dev",
            version: "1.0.0",
            devDependencies: {
              "foo-package-1-name": "1.1.1"
            }
          }
        },
        "foo-only-deps": {
          folder: "foo-only-dev",
          dependencies: {
            "foo-package-1-name": "1.1.1"
          },
          devDependencies: {},
          packageJson: {
            name: "foo-only-deps",
            version: "1.0.0",
            dependencies: {
              "foo-package-1-name": "1.1.1"
            }
          }
        },
        "foo-package-1-name": {
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
            name: "foo-package-1-name",
            version: "1.0.0",
            dependencies: {
              "foo-1": "1.0.0",
              "foo-package-2-name": "2.0.0"
            },
            devDependencies: {
              "foo-package-3-name": "2.0.0",
              "foo-4": "4.0.0"
            }
          }
        },
        "foo-package-2-name": {
          folder: "foo-package-2",
          dependencies: {
            "foo-1": "1.0.0",
            "foo-package-3-name": "3.0.0"
          },
          devDependencies: {
            "foo-3": "3.0.0",
            "foo-4": "4.0.0"
          },
          packageJson: {
            name: "foo-package-2-name",
            version: "2.0.0",
            dependencies: {
              "foo-1": "1.0.0",
              "foo-package-3-name": "3.0.0"
            },
            devDependencies: {
              "foo-3": "3.0.0",
              "foo-4": "4.0.0"
            }
          }
        },
        "foo-package-3-name": {
          folder: "foo-package-3",
          dependencies: {
            "foo-1": "1.0.0",
            "foo-2": "2.0.0"
          },
          devDependencies: {
            "foo-3": "3.0.0",
            "foo-4": "4.0.0"
          },
          packageJson: {
            name: "foo-package-3-name",
            version: "3.0.0",
            dependencies: {
              "foo-1": "1.0.0",
              "foo-2": "2.0.0"
            },
            devDependencies: {
              "foo-3": "3.0.0",
              "foo-4": "4.0.0"
            }
          }
        }
      });
    });
  });

  describe("readCurrent method", () => {
    it("should return current package info", async () => {
      expect.assertions(4);
      const currentPackageInfo = await packages.readCurrent();
      expect(currentPackageInfo.folder).toEqual("npm-file-link");
      expect(currentPackageInfo.dependencies).toEqual(packageInfo.dependencies);
      expect(currentPackageInfo.devDependencies).toEqual(packageInfo.devDependencies);
      expect(currentPackageInfo.packageJson).toEqual(packageInfo);
    });
  });

  describe("writePackageJson method", () => {
    it("should write package info to package.json file", async () => {
      const fooFolder = "foo-folder";
      const fooPackage = {
        foo: "foo"
      };
      expect.assertions(2);
      await packages.writePackageJson(fooFolder, fooPackage);
      const writeCall = fsExtra.writeJson.getCall(0);
      expect(writeCall.args[0]).toEqual(
        expect.stringContaining(["fixtures", "foo-folder", "package.json"].join(path.sep))
      );
      expect(writeCall.args[1]).toEqual(fooPackage);
    });
  });
});
