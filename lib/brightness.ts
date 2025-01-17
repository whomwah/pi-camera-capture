import { calculateShutterSpeed, env } from "./utils.ts";

export const calcBrightness = async (
  run: (cmd1: string[], cmd2?: string[]) => Promise<string>,
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

  const brightnessValue = await run(libcameraArgs, convertArgs);
  const brightnessNumber = parseFloat(brightnessValue);
  const shutterSpeed = calculateShutterSpeed(brightnessNumber, brightness)
    .toString();

  return `${brightnessValue}:${shutterSpeed}`;
};
