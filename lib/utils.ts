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
 * Executes a given asynchronous action and logs the result.
 *
 * @param action - The asynchronous action to be executed. It should return a Promise that resolves to a string or void.
 * @param successMessage - The message to log if the action is successful.
 * @param errorMessage - The message to log if the action fails.
 * @returns A Promise that resolves to the result of the action if successful, otherwise undefined.
 */
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
    log.error(errorMessage, (e as Error).message);
  }
}

// Constants for easy tuning
export const MIN_SHUTTER = 10000;
export const MAX_SHUTTER = 6000000;
export const MIN_BRIGHTNESS = 435;
export const MAX_BRIGHTNESS = 52000;
const BASE_SHUTTER = 50000;
const DARK_SCALING_FACTOR = 500;
const DARK_THRESHOLD_PCT = 3;
const LIGHT_THRESHOLD_PCT = 93;
const BRIGHT_SCALING_FACTOR = 5;

export function calculateShutterSpeed(brightness: number, adjustment = 1.0) {
  // Ensure brightness is not below min
  if (brightness < MIN_BRIGHTNESS) {
    brightness = MIN_BRIGHTNESS;
  }

  // Convert to percentage for thresholds
  const brightnessPercent = (brightness / MAX_BRIGHTNESS) * 100;

  // Gradual dark multiplier
  let darkMultiplier = 1.0;
  if (brightnessPercent < DARK_THRESHOLD_PCT) {
    darkMultiplier = 1 +
      (DARK_THRESHOLD_PCT - brightnessPercent) / DARK_SCALING_FACTOR;
  }

  // Gradual light multiplier
  let brightMultiplier = 1.0;
  if (brightnessPercent > LIGHT_THRESHOLD_PCT) {
    brightMultiplier = 1 +
      (brightnessPercent - LIGHT_THRESHOLD_PCT) / BRIGHT_SCALING_FACTOR;
  }

  // Base calculation
  const baseShutter = (MAX_BRIGHTNESS / brightness) * BASE_SHUTTER;

  // Apply multipliers and adjustment
  // Dark multiplier raises shutter, bright lowers it
  const adjustedShutter = (baseShutter * darkMultiplier * adjustment) /
    brightMultiplier;

  // Constrain within limits
  return Math.round(
    Math.min(Math.max(adjustedShutter, MIN_SHUTTER), MAX_SHUTTER),
  );
}

/**
 * Executes two commands in a piped manner, where the output of the first command
 * is used as the input for the second command. If the second command is not provided,
 * it simply returns the output of the first command.
 *
 * @param cmd1 - The first command to execute, represented as an array of strings where the first element is the command and the rest are the arguments.
 * @param cmd2 - (Optional) The second command to execute, represented as an array of strings where the first element is the command and the rest are the arguments.
 * @returns A promise that resolves to the final output of the executed commands as a string.
 */
export async function runPipedCommands(
  cmd1: string[],
  cmd2?: string[],
): Promise<string> {
  // Create first process that writes to stdout
  const p1 = new Deno.Command(cmd1[0], {
    args: cmd1.slice(1),
    stdout: "piped",
  });

  // Start the first process
  const proc1 = p1.spawn();

  if (cmd2) {
    // Create second process that reads from stdin
    const p2 = new Deno.Command(cmd2[0], {
      args: cmd2.slice(1),
      stdin: "piped",
      stdout: "piped",
    });

    // Start the second process
    const proc2 = p2.spawn();

    // Pipe output from proc1 to proc2
    await proc1.stdout.pipeTo(proc2.stdin);

    // Get final output from proc2
    return decodeProcessOutput(proc2);
  }

  // Get final output from proc1 if cmd2 is not provided
  return decodeProcessOutput(proc1);
}

/**
 * Decodes the output of a given Deno child process.
 *
 * @param proc - The Deno child process whose output needs to be decoded.
 * @returns A promise that resolves to the decoded output as a string.
 */
async function decodeProcessOutput(proc: Deno.ChildProcess): Promise<string> {
  try {
    const { stdout } = await proc.output();
    return new TextDecoder().decode(stdout);
  } catch (error) {
    throw new Error(
      `Process output decode failed: ${(error as Error).message}`,
    );
  }
}
