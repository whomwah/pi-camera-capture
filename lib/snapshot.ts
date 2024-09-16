import { env } from "./utils.ts";

/**
 * Takes a snapshot using the specified `run` function and saves it to the given `snapshotPath`.
 *
 * @param run - A function that takes an array of string arguments and returns a promise that resolves to a string.
 * @param snapshotPath - The path where the snapshot will be saved.
 * @returns A promise that resolves when the snapshot is taken.
 */
export const takeSnapshot = async (
  run: (args: string[]) => Promise<string>,
  snapshotPath: string,
) => {
  await run([
    env("SNAPSHOT_CMD"),
    "-o",
    snapshotPath,
    "--rotation",
    "180",
    "--autofocus-range",
    "full",
    "--hdr",
    "auto",
    "--immediate",
    "--metering",
  ]);
};
