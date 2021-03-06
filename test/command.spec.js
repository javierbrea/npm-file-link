/*
Copyright 2019 Javier Brea
Copyright 2019 XbyOrange

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

const sinon = require("sinon");

const link = require("../src/link");
const unlink = require("../src/unlink");
const check = require("../src/check");

const command = require("../src/command");

describe("command", () => {
  let sandbox;
  let originalArgs;

  beforeAll(() => {
    originalArgs = [...process.argv];
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(link, "all").resolves();
    sandbox.stub(link, "select").resolves();
    sandbox.stub(unlink, "all").resolves();
    sandbox.stub(check, "avoidFileLinks").resolves();
  });

  afterEach(() => {
    process.argv = [...originalArgs];
    sandbox.restore();
  });

  describe("runAndCatch method", () => {
    it("should mark process to exit with error if command throws an error", async () => {
      expect.assertions(2);
      link.select.rejects(new Error("Foo error"));
      sandbox.stub(console, "log");
      await command.runAndCatch();
      expect(process.exitCode).toEqual(1);
      process.exitCode = 0;
      expect(console.log.getCall(0).args[0]).toEqual(expect.stringContaining("Foo error"));
    });

    it("should link selected packages by default", async () => {
      expect.assertions(1);
      await command.runAndCatch();
      expect(link.select.callCount).toEqual(1);
    });

    it("should link all packages if --all option is received", async () => {
      expect.assertions(1);
      process.argv.push("--all");
      await command.runAndCatch();
      expect(link.all.callCount).toEqual(1);
    });

    it("should unlink all packages if --all and --unlink options are received", async () => {
      expect.assertions(1);
      process.argv.push("--all");
      process.argv.push("--unlink");
      await command.runAndCatch();
      expect(unlink.all.callCount).toEqual(1);
    });

    it("should check links if --check option is received", async () => {
      expect.assertions(1);
      process.argv.push("--check");
      await command.runAndCatch();
      expect(check.avoidFileLinks.callCount).toEqual(1);
    });
  });
});
