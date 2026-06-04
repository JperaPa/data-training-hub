import Ajv from "ajv";
import addFormats from "ajv-formats";

export class BaseAgent {
  constructor(agentName, schema) {
    this.agentName = agentName;
    this.schema = schema;

    const ajv = new Ajv({ allErrors: true });
    addFormats(ajv);
    this.validator = ajv.compile(schema);
  }

  validate(output) {
    const valid = this.validator(output);
    if (!valid) {
      throw new Error(
        `Schema validation failed for ${this.agentName}: ${JSON.stringify(
          this.validator.errors,
          null,
          2
        )}`
      );
    }
  }
}