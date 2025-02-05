import { env } from "./utils.ts";

interface SnapShot {
  run: (cmd1: string[], cmd2?: string[]) => Promise<string>;
  snapshotPath: string;
  shutterSpeed?: string;
  quality?: string;
}

/**
 * Takes a snapshot using the specified parameters.
 *
 * @param {SnapShot} params - The parameters for taking the snapshot.
 * @param {string} params.snapshotPath - The file path where the snapshot will be saved.
 * @param {number} [params.quality=93] - The quality of the snapshot (default is 93).
 * @param {number} [params.shutterSpeed=60000] - The shutter speed for the snapshot in microseconds (default is 60000).
 * @param {Function} params.run - The function to execute the snapshot command with the provided arguments.
 * @returns {Promise<any>} A promise that resolves when the snapshot is taken.
 */
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
