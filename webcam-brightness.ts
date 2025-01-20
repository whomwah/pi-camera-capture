#!/usr/bin/env -S deno run --allow-run --allow-read --allow-write

import { calcBrightness } from "./lib/brightness.ts";
import { takeSnapshot } from "./lib/snapshot.ts";
import { executeWithLogging, runPipedCommands } from "./lib/utils.ts";

const runCheck = async () => {
  const results = await executeWithLogging(
    () => calcBrightness(runPipedCommands, 0.8),
    "Brightness found",
    "Brightness check failed!",
  ) as string;

  const [brightness, shutterSpeed] = results.split(":");

  await executeWithLogging(
    () => takeSnapshot(runPipedCommands, "brightness.jpg", shutterSpeed),
    `Snapshot taken with --shutter ${shutterSpeed} for brightness ${brightness}`,
    "Brightness check failed!",
  );
};

runCheck();
