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
    log.error(errorMessage, (e as Error).message);
  }
}

/**
 * Calculates optimal shutter speed based on measured brightness
 * @param {number} brightness - The measured brightness value from imagemagick
 * @param {number} adjustment - Adjustment factor (default 1.0, higher = brighter)
 * @returns {number} Shutter speed in microseconds (constrained between 100-100000)
 */
export function calculateShutterSpeed(brightness: number, adjustment = 1.0) {
  // Constants for easy tuning
  const MAX_BRIGHTNESS = 50000; // Maximum brightness value from ImageMagick
  const DARK_THRESHOLD_PCT = 10; // Percentage where dark adjustment begins (~19660)
  const BASE_SHUTTER = 50000; // Base shutter speed in microseconds
  const MIN_SHUTTER = 100; // Minimum shutter speed (1/10000s)
  const MAX_SHUTTER = 5000000; // Maximum shutter speed (1/0.2s)
  const DARK_SCALING_FACTOR = 10; // Controls exponential scaling in dark

  // Convert to percentage (0-100) for easier threshold checks
  const brightnessPercent = (brightness / MAX_BRIGHTNESS) * 100;

  // Calculate dark multiplier
  let darkMultiplier = 1.0;
  if (brightnessPercent < DARK_THRESHOLD_PCT) {
    darkMultiplier = Math.pow(
      2,
      (DARK_THRESHOLD_PCT - brightnessPercent) /
        DARK_SCALING_FACTOR,
    );
  }

  // Base calculation with inverse relationship between brightness and shutter
  const baseShutter = (MAX_BRIGHTNESS / brightness) * BASE_SHUTTER;

  // Apply both dark condition multiplier and user adjustment
  const adjustedShutter = baseShutter * darkMultiplier * adjustment;

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
    const { stdout } = await proc2.output();
    return new TextDecoder().decode(stdout);
  } else {
    // Get final output from proc1 if cmd2 is not provided
    const { stdout } = await proc1.output();
    return new TextDecoder().decode(stdout);
  }
}
