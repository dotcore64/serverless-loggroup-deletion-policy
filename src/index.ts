import Serverless from "serverless";
import Plugin, { Logging } from "serverless/classes/Plugin.js"; // eslint-disable-line n/no-missing-import

export default class LambdaLogKeeperPlugin implements Plugin {
  readonly hooks: { [key: string]: any } = {
    "before:package:finalize": () => this.setDeletionRetainOnLambdaLogs(),
  };

  readonly name: string = "serverless-loggroup-deletion-policy";

  config: { keepLambdaLogs: boolean };

  constructor(
    private serverless: Serverless,
    private options: Serverless.Options,
    private logging: Logging
  ) {
    if (this.serverless.service.provider.name !== "aws") {
      throw new Error(
        "serverless-loggroup-deletion-policy can only be used with the 'aws' provider"
      );
    }

    this.serverless.configSchemaHandler.defineCustomProperties({
      type: "object",
      properties: {
        logGroupDeletionPolicy: {
          type: "object",
          properties: {
            keepLambdaLogs: {
              type: "boolean",
            },
          },
          required: ["keepLambdaLogs"],
        },
      },
    });

    this.config = this.serverless.service.custom?.logGroupDeletionPolicy;
    if (!this.config) {
      throw new Error(
        "Please specify `logGroupDeletionPolicy` in your serverless.yml file!"
      );
    }
  }

  setDeletionRetainOnLambdaLogs() {
    const { keepLambdaLogs } = this.config;

    if (typeof keepLambdaLogs !== "boolean") {
      throw new TypeError(
        "Please specify `logGroupDeletionPolicy.keepLambdaLogs` with true or false in your serverless.yml file!"
      );
    }

    const resources =
      this.serverless.service.provider.compiledCloudFormationTemplate.Resources;

    Object.values(resources)
      .filter(
        (resource) =>
          resource.Type === "AWS::Logs::LogGroup" &&
          resource.Properties?.LogGroupName?.startsWith?.("/aws/lambda")
      )
      .forEach((resource) => {
        const policy = keepLambdaLogs ? "Retain" : "Delete";

        this.logging.log.info(
          `setting DeletionPolicy: ${policy} on ${resource.Properties?.LogGroupName}`
        );

        resource.DeletionPolicy = policy; // eslint-disable-line no-param-reassign
      });
  }
}
