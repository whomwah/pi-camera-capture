#!/usr/bin/env -S deno run --allow-run --allow-read --allow-write

import { takeSnapshot } from "./lib/snapshot.ts";
import { processSnapshot } from "./lib/process.ts";
import { syncSnapshot } from "./lib/sync.ts";
import {
  executeWithLogging,
  getFormattedDate,
  runPipedCommands,
} from "./lib/utils.ts";
import { paths } from "./lib/config.ts";
import { calcBrightness } from "./lib/brightness.ts";

const runCameraCapture = async () => {
  const { iso } = getFormattedDate();

  const results = (await executeWithLogging(
    () => calcBrightness({ run: runPipedCommands, brightness: 1.0 }),
    "Brightness found",
    "Brightness check failed!",
  )) as string;

  const [brightness, shutterSpeed] = results.split(":");

  await executeWithLogging(
    () =>
      takeSnapshot({
        run: runPipedCommands,
        snapshotPath: paths.liveshotPath,
        shutterSpeed,
        quality: "60",
      }),
    `Snapshot taken: ${paths.liveshotPath} with --shutter ${shutterSpeed} for brightness ${brightness}`,
    `Snapshot [${iso}] failed!`,
  );

  await executeWithLogging(
    () =>
      processSnapshot({
        run: runPipedCommands,
        snapshotPath: paths.liveshotPath,
        iso,
      }),
    `Snapshot processed: ${paths.liveshotPath}`,
    `Snapshot [${iso}] processing failed!`,
  );

  await executeWithLogging(
    () => Deno.rename(paths.liveshotPath, paths.savePath("live")),
    `Snapshot file renamed to "live"`,
    `Error renaming snapshot to save path`,
  );

  await executeWithLogging(
    () => syncSnapshot({ run: runPipedCommands, imagePath: paths.imagesDir }),
    `Files synced with S3`,
    `Error syncing with S3`,
  );

  await executeWithLogging(
    () => Deno.rename(paths.savePath("live"), paths.scratchPath("live")),
    `Snapshot complete`,
    `Error renaming save and scratch path`,
  );
};

runCameraCapture();
