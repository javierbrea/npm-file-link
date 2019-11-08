/*
Copyright 2019 Javier Brea
Copyright 2019 XbyOrange

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

const path = require("path");

const sinon = require("sinon");

const paths = require("../src/utils/paths");
const packages = require("../src/utils/packages");
const npm = require("../src/npm");
const unlink = require("../src/unlink");

describe("unlink", () => {
  let sandbox;
  let writeStub;
  let workingPathStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    writeStub = sandbox.stub(packages, "writePackageJson").resolves();
    workingPathStub = sandbox
      .stub(paths, "getWorkingPath")
      .resolves(path.resolve(__dirname, "fixtures"));

    sandbox.stub(npm, "checkChangesAndInstall").resolves();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("all method", () => {
    it("should unlink all locally found dependencies in current package", async () => {
      expect.assertions(2);
      workingPathStub.restore();
      sandbox
        .stub(process, "cwd")
        .returns(path.resolve(__dirname, "linked-fixtures", "foo-linked-package"));
      expect.assertions(2);
      await unlink.all();

      expect(writeStub.getCall(0).args[0]).toEqual("foo-linked-package");
      expect(writeStub.getCall(0).args[1]).toEqual({
        name: "foo-linked-package-name-2",
        version: "1.0.0",
        dependencies: {
          "foo-package-1-name-2": "1.0.0"
        }
      });
    });

    it("should unlink all locally found devDependencies in current package", async () => {
      expect.assertions(2);
      workingPathStub.restore();
      sandbox
        .stub(process, "cwd")
        .returns(path.resolve(__dirname, "linked-fixtures", "foo-only-deps"));
      expect.assertions(2);
      await unlink.all();

      expect(writeStub.getCall(0).args[0]).toEqual("foo-only-deps");
      expect(writeStub.getCall(0).args[1]).toEqual({
        name: "foo-only-dev-2",
        version: "1.0.0",
        devDependencies: {
          "foo-package-1-name-2": "1.0.0"
        }
      });
    });

    it("should assign packages versions if no previous versions are stored in package.json", async () => {
      expect.assertions(2);
      workingPathStub.restore();
      sandbox
        .stub(process, "cwd")
        .returns(path.resolve(__dirname, "linked-fixtures", "foo-linked-package-no-originals"));
      expect.assertions(2);
      await unlink.all();

      expect(writeStub.getCall(0).args[0]).toEqual("foo-linked-package-no-originals");
      expect(writeStub.getCall(0).args[1]).toEqual({
        name: "foo-linked-package-no-originals",
        version: "1.0.0",
        dependencies: {
          "foo-only-deps-2": "1.0.0"
        },
        devDependencies: {
          "foo-package-1-name-2": "1.0.0"
        }
      });
    });
  });
});
