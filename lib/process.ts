import { env } from "./utils.ts";

/**
 * Processes a snapshot by running a command with the provided arguments.
 *
 * @param run - The function that runs the command with the provided arguments.
 * @param snapshotPath - The path to the snapshot file.
 * @param iso - The ISO value associated with the snapshot.
 * @returns A Promise that resolves when the snapshot processing is complete.
 */
export const processSnapshot = async (
  run: (args: string[]) => Promise<string>,
  snapshotPath: string,
  iso: string,
) => {
  await run([
    env("CONVERT_CMD"),
    snapshotPath,
    "-font",
    "Helvetica",
    "-stroke",
    "white",
    "-pointsize",
    "40",
    "-fill",
    "#FFF",
    "-gravity",
    "northwest",
    "-draw",
    "roundRectangle 40,40,558,100 10,10",
    "-strokewidth",
    "2",
    "-stroke",
    "black",
    "-fill",
    "black",
    "-annotate",
    "+60+45",
    iso,
    snapshotPath,
  ]);
};
