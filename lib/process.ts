import { env } from "./utils.ts";

interface ProcessSnapshot {
  run: (cmd1: string[], cmd2?: string[]) => Promise<string>;
  snapshotPath: string;
  iso: string;
}

/**
 * Processes a snapshot by running a series of image manipulation commands.
 *
 * @param {ProcessSnapshot} params - The parameters required to process the snapshot.
 * @param {Function} params.run - A function that executes the given commands.
 * @param {string} params.snapshotPath - The file path of the snapshot to be processed.
 * @param {string} params.iso - The ISO value to be annotated on the snapshot.
 *
 * @returns {Promise<void>} A promise that resolves when the processing is complete.
 */
export const processSnapshot = async (params: ProcessSnapshot) => {
  await params.run([
    env("CONVERT_CMD"),
    params.snapshotPath,
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
    params.iso,
    params.snapshotPath,
  ]);
};
