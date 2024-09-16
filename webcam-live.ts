#!/usr/bin/env -S deno run --allow-run --allow-read --allow-write

import { run } from "run_simple";
import { takeSnapshot } from "./lib/snapshot.ts";
import { processSnapshot } from "./lib/process.ts";
import { syncSnapshot } from "./lib/sync.ts";
import { executeWithLogging, getFormattedDate } from "./lib/utils.ts";
import { paths } from "./lib/config.ts";

const runCameraCapture = async () => {
  const { iso } = getFormattedDate();

  await executeWithLogging(
    () => takeSnapshot(run, paths.snapshotPath),
    `Snapshot taken: ${paths.snapshotPath}`,
    `Snapshot [${iso}] failed!`,
  );

  await executeWithLogging(
    () => processSnapshot(run, paths.snapshotPath, iso),
    `Snapshot processed: ${paths.snapshotPath}`,
    `Snapshot [${iso}] processing failed!`,
  );

  await executeWithLogging(
    () => Deno.rename(paths.snapshotPath, paths.savePath("live")),
    `Snapshot file renamed to "live"`,
    `Error renaming snapshot to save path`,
  );

  await executeWithLogging(
    () => syncSnapshot(run, paths.imagesDir),
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
