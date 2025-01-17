import * as log from "@std/log";

/**
 * Retrieves the value of the specified environment variable.
 *
 * @param name - The name of the environment variable.
 * @returns The value of the environment variable, or an empty string if it is not defined.
 */
export const env = (name: string) => Deno.env.get(name) || "";

/**
 * Returns the formatted date and ISO string.
 *
 * @returns An object containing the formatted date and ISO string.
 */
export const getFormattedDate = () => {
  const date = new Date();
  const iso = date.toISOString();
  return { dateString: iso.slice(0, 10), iso };
};

export async function executeWithLogging(
  action: () => Promise<string | void>,
  successMessage: string,
  errorMessage: string,
) {
  try {
    const result = await action();
    log.info(successMessage);
    return result;
  } catch (e) {
    log.error(errorMessage, e.message);
  }
}
