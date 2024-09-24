import { env } from "./utils.ts";

const config = {
  fileExt: env("IMAGE_FILE_EXT"),
  workingDir: env("WORK_DIR"),
  movieFileName: env("MOVIE_FILE_NAME"),
  movieFileExt: env("MOVIE_FILE_EXT"),
};

export const paths = {
  backupDir: `${config.workingDir}/backup`,
  imagesDir: `${config.workingDir}/images`,
  snapshotPath: `${config.workingDir}/images/snapshot${config.fileExt}`,
  liveshotPath: `${config.workingDir}/images/live${config.fileExt}`,
  videoImagesPath: `${config.workingDir}/backup/*${config.fileExt}`,
  videoPath:
    `${config.workingDir}/backup/${config.movieFileName}${config.movieFileExt}`,
  savePath: (fn: string) =>
    `${config.workingDir}/images/${fn}${config.fileExt}`,
  scratchPath: (fn: string) =>
    `${config.workingDir}/backup/${fn}${config.fileExt}`,
};
