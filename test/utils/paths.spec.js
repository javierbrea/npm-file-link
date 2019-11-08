/*
Copyright 2019 Javier Brea
Copyright 2019 XbyOrange

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

const path = require("path");

const sinon = require("sinon");

const paths = require("../../src/utils/paths");

describe("paths", () => {
  let sandbox;
  let cwdStub;
  const fixturesPath = path.resolve(__dirname, "..", "fixtures");

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    cwdStub = sandbox.stub(process, "cwd").returns(fixturesPath);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("getWorkingPath method", () => {
    it("should return current path if it does not contains a package.json file", async () => {
      const workingPath = await paths.getWorkingPath();
      expect(workingPath).toEqual(fixturesPath);
    });

    it("should return parent path if it contains a package.json file", async () => {
      const fooPackagePath = path.resolve(fixturesPath, "foo-package-1");
      cwdStub.returns(fooPackagePath);
      const workingPath = await paths.getWorkingPath();
      expect(workingPath).toEqual(fixturesPath);
    });
  });
});
