import { env } from "./utils.ts";

interface TimeLapse {
  run: (cmd1: string[], cmd2?: string[]) => Promise<string>;
  videoImagesPath: string;
  videoPath: string;
}

/**
 * Creates a time-lapse video using the provided parameters.
 *
 * @param {TimeLapse} params - The parameters for creating the time-lapse video.
 * @param {string} params.videoImagesPath - The path to the input image files.
 * @param {string} params.videoPath - The path to the output video file.
 * @param {Function} params.run - A function to execute the ffmpeg command with the specified arguments.
 *
 * @returns {Promise<void>} A promise that resolves when the video creation is complete.
 */
export const createTimeLapseVideo = async (params: TimeLapse) => {
  const ffmpegArgs = [
    env("FFMPEG_CMD"),
    "-y", // Overwrite output files without asking
    "-framerate",
    "10", // Set frame rate
    "-pattern_type",
    "glob", // Use glob pattern for input file matching
    "-i",
    params.videoImagesPath, // Input files path - corrected without extra quotes
    "-c:v",
    "libx264", // Video codec
    "-profile:v",
    "high", // Encoder profile
    "-crf",
    "20", // Constant Rate Factor for quality
    "-pix_fmt",
    "yuv420p", // Pixel format
    params.videoPath, // Output file path
  ];

  await params.run(ffmpegArgs);
};
