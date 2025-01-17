import { env } from "./utils.ts";

export const calcBrightness = async (
  brightness: number,
) => {
  const libcameraArgs = [
    env("SNAPSHOT_CMD"),
    "--immediate",
    "--width",
    "800",
    "--height",
    "600",
    "--shutter",
    "50000",
    "-o",
    "-", // Output to stdout
  ];

  const convertArgs = [
    env("CONVERT_CMD"),
    "jpeg:-", // Read from stdin
    "-colorspace",
    "Gray",
    "-format",
    "%[fx:quantumrange*mean]",
    "info:",
  ];

  const brightnessValue = await runPipedCommands(libcameraArgs, convertArgs);
  const brightnessNumber = parseFloat(brightnessValue);
  return calculateShutterSpeed(brightnessNumber, brightness).toString();
};

async function runPipedCommands(
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

/**
 * Calculates optimal shutter speed based on measured brightness
 * @param {number} brightness - The measured brightness value from imagemagick
 * @param {number} adjustment - Adjustment factor (default 1.0, higher = brighter)
 * @returns {number} Shutter speed in microseconds (constrained between 100-100000)
 */
function calculateShutterSpeed(brightness: number, adjustment = 1.0) {
  // Base calculation - inverse relationship between brightness and shutter
  const baseShutter = (65535 / brightness) * 50000;

  // Apply adjustment factor
  const adjustedShutter = baseShutter * adjustment;

  // Constrain between 100μs (1/10000s) and 100000μs (1/10s)
  return Math.round(Math.min(Math.max(adjustedShutter, 100), 100000));
}
