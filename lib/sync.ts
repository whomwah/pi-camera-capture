import { env } from "./utils.ts";

interface SyncSnaphot {
  run: (cmd1: string[], cmd2?: string[]) => Promise<string>;
  imagePath: string;
}

/**
 * Synchronizes snapshot images to an AWS S3 bucket.
 *
 * @param {SyncSnaphot} params - The parameters for the sync operation.
 * @param {Function} params.run - The function to execute the sync command.
 * @param {string} params.imagePath - The local path to the images.
 * @returns {Promise<void>} A promise that resolves when the sync operation is complete.
 */
export const syncSnapshot = async (params: SyncSnaphot) => {
  await params.run([
    env("AWS_CMD"),
    "s3",
    "sync",
    `${params.imagePath}/`,
    env("AWS_BUCKET"),
    "--exclude",
    "*",
    "--include",
    "*.jpg",
  ]);
};
