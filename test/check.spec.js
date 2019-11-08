/*
Copyright 2019 Javier Brea
Copyright 2019 XbyOrange

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

const path = require("path");

const sinon = require("sinon");

const check = require("../src/check");

describe("check", () => {
  let sandbox;
  let cwdStub;
  const fixturePath = path.resolve(__dirname, "fixtures", "foo-linked-package");

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    cwdStub = sandbox.stub(process, "cwd").returns(fixturePath);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("avoidFileLinks method", () => {
    it("should reject if find local links in a package", async () => {
      expect.assertions(1);
      await check.avoidFileLinks().catch(err => {
        expect(err.message).toEqual(expect.stringContaining("File links found"));
      });
    });

    it("should resolve if does not find local links in a package", async () => {
      cwdStub.returns(path.resolve(__dirname, "fixtures", "foo-package-1"));
      await expect(check.avoidFileLinks()).resolves.toEqual(undefined);
    });
  });
});
