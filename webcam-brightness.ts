#!/usr/bin/env -S deno run --allow-run --allow-read --allow-write

import { run } from "run_simple";
import { calcBrightness } from "./lib/brightness.ts";
import { takeSnapshot } from "./lib/snapshot.ts";
import { executeWithLogging } from "./lib/utils.ts";

const runCheck = async () => {
  const shutterSpeed = await executeWithLogging(
    () => calcBrightness(0.7),
    "Brightness found",
    "Brightness check failed!",
  ) as string;

  await executeWithLogging(
    () => takeSnapshot(run, "brightness.jpg", shutterSpeed),
    `Snapshot taken with --shutter ${shutterSpeed}`,
    "Brightness check failed!",
  );
};

runCheck();
