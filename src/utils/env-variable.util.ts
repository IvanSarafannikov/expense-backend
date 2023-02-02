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
const number = (name: string, required = true) => {
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
const string = (name: string, required = true) => {
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
const boolean = (name: string, required = true) => {
  const variable = getVariable(name, required);

  return Boolean(variable);
};

export const getEnv = {
  number,
  string,
  boolean,
};
