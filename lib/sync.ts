import { env } from "./utils.ts";

/**
 * Synchronizes files with S3 by copying all JPEG images from the local directory to the specified AWS S3 bucket.
 *
 * @param run - A function that takes an array of string arguments and returns a promise that resolves to a string.
 * @returns A promise that resolves when the synchronization is complete.
 */
export const syncSnapshot = async (
  run: (args: string[]) => Promise<string>,
  imagePath: string,
) => {
  await run([
    env("AWS_CMD"),
    "s3",
    "sync",
    `${imagePath}/`,
    env("AWS_BUCKET"),
    "--exclude",
    "*",
    "--include",
    "*.jpg",
  ]);
};
