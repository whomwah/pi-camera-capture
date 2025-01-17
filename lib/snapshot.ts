import { env } from "./utils.ts";

export const takeSnapshot = async (
  run: (args: string[]) => Promise<string>,
  snapshotPath: string,
  shutterSpeed?: string,
) => {
  return await run([
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
    "--gain",
    "1.5",
  ]);
};
