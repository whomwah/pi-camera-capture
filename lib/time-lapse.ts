import { env } from "./utils.ts";

export const createTimeLapseVideo = async (
  run: (args: string[]) => Promise<string>,
  videoImagesPath: string,
  videoPath: string,
) => {
  const ffmpegArgs = [
    env("FFMPEG_CMD"),
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
};
