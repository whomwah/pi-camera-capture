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

/**
 * Executes a given action with logging and handles any errors that occur.
 *
 * @param action - The action to be executed.
 * @param successMessage - The success message to be logged if the action is successful.
 * @param errorMessage - The error message to be logged if the action fails.
 * @returns A promise that resolves when the action is completed.
 */
export async function executeWithLogging(
  action: () => Promise<void>,
  successMessage: string,
  errorMessage: string,
) {
  try {
    await action();
    log.info(successMessage);
  } catch (e) {
    log.error(errorMessage, e.message);
  }
}
