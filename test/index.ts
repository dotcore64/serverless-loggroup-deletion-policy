import { join } from "node:path";
import { createRequire } from "node:module";
import { expect } from "chai";

import logEmitter from "log/lib/emitter.js";
import runServerless from "@serverless/test/run-serverless.js";

const require = createRequire(import.meta.url);
const serverlessRoot = join(require.resolve("serverless"), "..", "..");

const logsBuffer = [];
logEmitter.on("log", (event) => {
  const {
    logger: { namespace },
    messageTokens,
  } = event;
  if (namespace === "serverless:plugin:serverless-loggroup-deletion-policy") {
    logsBuffer.push(messageTokens[0]);
  }
});

describe("serverless-loggroup-deletion-policy", () => {
  beforeEach(() => {
    logsBuffer.splice(0, logsBuffer.length);
  });

  describe("serverless plugin sets a DeletionPolicy correctly", () => {
    it("adds a `DeletionPolicy: Retain` to Log Group", async () => {
      const cwd = new URL("fixtures/retain", import.meta.url).pathname;
      await runServerless(serverlessRoot, {
        cwd,
        command: "package",
      });

      // eslint-disable-next-line import/no-dynamic-require
      const resources = require(join(
        cwd,
        ".serverless",
        "cloudformation-template-update-stack.json"
      )).Resources;

      expect(logsBuffer).to.deep.equal([
        "setting DeletionPolicy: Retain on /aws/lambda/retain-dev-hello",
      ]);
      expect(resources.HelloLogGroup.DeletionPolicy).to.equal("Retain");
    });

    it("adds a `DeletionPolicy: Delete` to Log Group", async () => {
      const cwd = new URL("fixtures/delete", import.meta.url).pathname;
      await runServerless(serverlessRoot, {
        cwd,
        command: "package",
      });

      // eslint-disable-next-line import/no-dynamic-require
      const resources = require(join(
        cwd,
        ".serverless",
        "cloudformation-template-update-stack.json"
      )).Resources;

      expect(logsBuffer).to.deep.equal([
        "setting DeletionPolicy: Delete on /aws/lambda/delete-dev-hello",
      ]);
      expect(resources.HelloLogGroup.DeletionPolicy).to.equal("Delete");
    });

    it("adds a `DeletionPolicy: Retain` to Log Group via variable", async () => {
      const cwd = new URL("fixtures/variable", import.meta.url).pathname;
      await runServerless(serverlessRoot, {
        cwd,
        command: "package",
      });

      // eslint-disable-next-line import/no-dynamic-require
      const resources = require(join(
        cwd,
        ".serverless",
        "cloudformation-template-update-stack.json"
      )).Resources;

      expect(logsBuffer).to.deep.equal([
        "setting DeletionPolicy: Retain on /aws/lambda/variable-dev-hello",
      ]);
      expect(resources.HelloLogGroup.DeletionPolicy).to.equal("Retain");
    });
  });

  describe("plugin configuration and usage", () => {
    it("errors out if using non-aws provider", async () => {
      const cwd = new URL("fixtures/gcp", import.meta.url).pathname;

      return expect(
        runServerless(serverlessRoot, {
          cwd,
          command: "package",
        })
      ).to.be.rejectedWith(
        Error,
        "serverless-loggroup-deletion-policy can only be used with the 'aws' provider"
      );
    });

    it("errors out on missing logGroupDeletionPolicy config object", async () => {
      const cwd = new URL("fixtures/invalid", import.meta.url).pathname;

      return expect(
        runServerless(serverlessRoot, {
          cwd,
          command: "package",
        })
      ).to.be.rejectedWith(
        Error,
        "Please specify `logGroupDeletionPolicy` in your serverless.yml file!"
      );
    });

    it("errors out on missing keepLambdaLogs", async () => {
      const cwd = new URL("fixtures/non-boolean", import.meta.url).pathname;

      return expect(
        runServerless(serverlessRoot, {
          cwd,
          command: "package",
        })
      ).to.be.rejectedWith(
        Error,
        /Configuration error at 'custom.logGroupDeletionPolicy.keepLambdaLogs': must be boolean/
      );
    });

    it("errors out on missing keepLambdaLogs with configValidationMode warn", async () => {
      const cwd = new URL("fixtures/non-boolean-warn", import.meta.url)
        .pathname;

      return expect(
        runServerless(serverlessRoot, {
          cwd,
          command: "package",
        })
      ).to.be.rejectedWith(
        Error,
        "Please specify `logGroupDeletionPolicy.keepLambdaLogs` with true or false in your serverless.yml file!"
      );
    });
  });
});
