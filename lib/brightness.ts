import { calculateShutterSpeed, env } from "./utils.ts";

interface CalcBrightness {
  run: (cmd1: string[], cmd2?: string[]) => Promise<string>;
  brightness: number;
}

/**
 * Calculates the brightness of an image captured by the camera and determines the appropriate shutter speed.
 *
 * @param {CalcBrightness} params - The parameters required to calculate brightness and shutter speed.
 * @param {Function} params.run - A function that executes the given commands and returns the brightness value as a string.
 * @param {number} params.brightness - The target brightness value to achieve.
 * @returns {Promise<string>} A promise that resolves to a string containing the brightness value and the calculated shutter speed, separated by a colon.
 */
export const calcBrightness = async (params: CalcBrightness) => {
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

  const brightnessValue = await params.run(libcameraArgs, convertArgs);
  const brightnessNumber = parseFloat(brightnessValue);
  const shutterSpeed = calculateShutterSpeed(
    brightnessNumber,
    params.brightness,
  )
    .toString();

  return `${brightnessValue}:${shutterSpeed}`;
};
