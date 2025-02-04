#!/usr/bin/env -S deno run --allow-run --allow-read --allow-write

import { takeSnapshot } from "./lib/snapshot.ts";
import { processSnapshot } from "./lib/process.ts";
import { syncSnapshot } from "./lib/sync.ts";
// import { createTimeLapseVideo } from "./lib/time-lapse.ts";
import {
  executeWithLogging,
  getFormattedDate,
  runPipedCommands,
} from "./lib/utils.ts";
import { paths } from "./lib/config.ts";
import { calcBrightness } from "./lib/brightness.ts";

const runCameraCapture = async () => {
  const { iso } = getFormattedDate();

  const results = await executeWithLogging(
    () => calcBrightness(runPipedCommands, 1.0),
    "Brightness found",
    "Brightness check failed!",
  ) as string;

  const [brightness, shutterSpeed] = results.split(":");

  await executeWithLogging(
    () => takeSnapshot(runPipedCommands, paths.snapshotPath, shutterSpeed),
    `Snapshot taken: ${paths.snapshotPath} with --shutter ${shutterSpeed} for brightness ${brightness}`,
    `Snapshot [${iso}] failed!`,
  );

  await executeWithLogging(
    () => processSnapshot(runPipedCommands, paths.snapshotPath, iso),
    `Snapshot processed: ${paths.snapshotPath}`,
    `Snapshot [${iso}] processing failed!`,
  );

  await executeWithLogging(
    () => Deno.rename(paths.snapshotPath, paths.savePath(iso)),
    `Snapshot file renamed to ${iso}`,
    `Error renaming snapshot to save path`,
  );

  await executeWithLogging(
    () => syncSnapshot(runPipedCommands, paths.imagesDir),
    `Files synced with S3`,
    `Error syncing with S3`,
  );

  await executeWithLogging(
    () => Deno.rename(paths.savePath(iso), paths.scratchPath(iso)),
    `Snapshot complete`,
    `Error renaming save and scratch path`,
  );

  // Uncomment to create timelapse video on device
  //
  // await executeWithLogging(
  //   () => createTimeLapseVideo(runPipedCommands, paths.videoImagesPath, paths.videoPath),
  //   `Time-lapse video updated: ${paths.videoPath}`,
  //   `Time-lapse video update failed!`,
  // );
};

runCameraCapture();
