import { env } from "./utils.ts";

export const takeSnapshot = async (
  run: (cmd1: string[], cmd2?: string[]) => Promise<string>,
  snapshotPath: string,
  shutterSpeed?: string,
) => {
  const libcameraArgs = [
    env("SNAPSHOT_CMD"),
    "-o",
    snapshotPath,
    "--immediate",
    "--width",
    "2664",
    "--height",
    "1980",
    "--shutter",
    shutterSpeed || "60000",
  ];

  return await run(libcameraArgs);
};
