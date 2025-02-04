import { env } from "./utils.ts";

interface SnapShot {
  run: (cmd1: string[], cmd2?: string[]) => Promise<string>;
  snapshotPath: string;
  shutterSpeed?: string;
  quality?: string;
}

export const takeSnapshot = async (params: SnapShot) => {
  const libcameraArgs = [
    env("SNAPSHOT_CMD"),
    "-o",
    params.snapshotPath,
    "--immediate",
    "--width",
    "2664",
    "--height",
    "1980",
    "--quality",
    params.quality || "93",
    "--shutter",
    params.shutterSpeed || "60000",
  ];

  return await params.run(libcameraArgs);
};
