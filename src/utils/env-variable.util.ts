/**
 * Env variable helper
 *
 * @param name variable name
 * @param required variable is required
 * @returns env variable
 */
const getVariable = (name: string, required: boolean) => {
  const variable = process.env[name];

  if (!variable && required) {
    throw new Error(`Environment variable ${name} is required`);
  }

  return variable;
};

/**
 * Get env variable and parse to number
 *
 * If variable is required but not exists it throws an error
 *
 * @param name variable name
 * @param required variable is required, by `default` true
 * @returns env variable
 */
const getNumberVariable = (name: string, required = true) => {
  const variable = getVariable(name, required);

  return parseInt(variable);
};

/**
 * Get env variable
 *
 * If variable is required but not exists it throws an error
 *
 * @param name variable name
 * @param required variable is required, by `default` true
 * @returns env variable
 */
const getStringVariable = (name: string, required = true) => {
  return getVariable(name, required);
};

/**
 * Get env variable and parse to boolean
 *
 * If variable is required but not exists it throws an error
 *
 * @param name variable name
 * @param required variable is required, by `default` true
 * @returns env variable
 */
const getBooleanVariable = (name: string, required = true) => {
  const variable = getVariable(name, required);

  return Boolean(variable);
};

/**
 * Decorator to set env variable
 *
 * @param name variable name
 * @param required variable is required
 */
export function SetEnvAsString(
  name: string,
  required = true,
): PropertyDecorator {
  return (target: Record<string, any>, key: string | symbol) => {
    target[key as string] = getStringVariable(name, required);
  };
}

/**
 * Decorator to set env variable
 *
 * @param name variable name
 * @param required variable is required
 */
export function SetEnvAsNumber(
  name: string,
  required = true,
): PropertyDecorator {
  return (target: Record<string, any>, key: string | symbol) => {
    target[key as string] = getNumberVariable(name, required);
  };
}

/**
 * Decorator to set env variable
 *
 * @param name variable name
 * @param required variable is required
 */
export function SetEnvAsBoolean(
  name: string,
  required = true,
): PropertyDecorator {
  return (target: Record<string, any>, key: string | symbol) => {
    target[key as string] = getStringVariable(name, required);
  };
}

export const getEnv = {
  number: getNumberVariable,
  string: getStringVariable,
  boolean: getBooleanVariable,
};
