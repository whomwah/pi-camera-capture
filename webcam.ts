#!/usr/bin/env -S deno run --allow-run --allow-read --allow-write

import { run } from "https://deno.land/x/run_simple@2.3.0/mod.ts";
import * as log from "https://deno.land/std@0.222.1/log/mod.ts";

const WORK_DIR = "/home/webcam/_dev/webcam";
const SNAPSHOT_CMD = "/usr/bin/libcamera-still";
const CONVERT_CMD = "/usr/bin/convert";
const AWS_CMD = "/usr/local/bin/aws";
const FFMPEG_CMD = "/usr/bin/ffmpeg";
const AWS_BUCKET = "s3://kyan-office-webcam/";

const runCameraCapture = async () => {
  const cameraCmd = SNAPSHOT_CMD;
  const convertCmd = CONVERT_CMD;
  const awsCmd = AWS_CMD;
  const awsBucket = AWS_BUCKET;
  const ffmpegCmd = FFMPEG_CMD;
  const snapshotPath = `${WORK_DIR}/images/snapshot.jpg`;
  const videoImagesPath = `${WORK_DIR}/backup/*.jpg`;
  const videoPath = `${WORK_DIR}/backup/timelapse.mp4`;

  const savePath = (fn: string) => `${WORK_DIR}/images/${fn}.jpg`;
  const scratchPath = (fn: string) => `${WORK_DIR}/backup/${fn}.jpg`;
  const date = new Date();
  const iso = date.toISOString();
  const dateString = iso.slice(0, 10);

  try {
    log.info(`Snapshot [${iso}] being taken...`);

    await run(
      [
        cameraCmd,
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
        "average",
        "--awb",
        "daylight",
        "--shutter",
        "10000",
      ],
    );
  } catch (e) {
    log.error(`Snapshot [${iso}] failed!`, e.message);
    return;
  }

  try {
    log.info(`Snapshot [${iso}] processing...`);

    await run(
      [
        convertCmd,
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
      ],
    );
  } catch (e) {
    log.error(`Snapshot [${iso}] processing failed!`, e.message);
  }

  await Deno.rename(snapshotPath, savePath(dateString));

  try {
    log.info(`Syncing files with S3...`);

    await run(
      [
        awsCmd,
        "s3",
        "sync",
        `${WORK_DIR}/images/`,
        awsBucket,
        "--exclude",
        "*",
        "--include",
        "*.jpg",
      ],
    );
  } catch (e) {
    log.error(`Syncing files with S3 failed!`, e.message);
  }

  await Deno.rename(savePath(dateString), scratchPath(iso));

  log.info(`Snapshot complete: ${savePath(iso)}`);

  try {
    const ffmpegArgs = [
      ffmpegCmd,
      "-y", // Overwrite output files without asking
      "-framerate",
      "10", // Set frame rate
      "-pattern_type",
      "glob", // Use glob pattern for input file matching
      "-i",
      videoImagesPath, // Input files path - corrected without extra quotes
      "-c:v",
      "libx264", // Video codec
      "-profile:v",
      "high", // Encoder profile
      "-crf",
      "20", // Constant Rate Factor for quality
      "-pix_fmt",
      "yuv420p", // Pixel format
      videoPath, // Output file path
    ];

    await run(ffmpegArgs);

    log.info(`Timelapse video updated: ${videoPath}`);
  } catch (e) {
    log.error("Timelapse video updated failed!", e.message);
  }
};

runCameraCapture();
