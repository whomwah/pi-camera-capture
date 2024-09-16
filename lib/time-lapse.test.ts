import { assertSpyCall, assertSpyCalls, stub } from "jsr:@std/testing/mock";
import { mockRun } from "../__mocks/mocks.ts";
import { createTimeLapseVideo } from "./time-lapse.ts";

Deno.test("createTimeLapseVideo calls run with correct arguments", async () => {
  const videoImagesPath = "video/images";
  const videoPath = "path/to/video";
  const mockEnv = stub(Deno.env, "get", () => "ffmpeg");

  await createTimeLapseVideo(mockRun, videoImagesPath, videoPath);

  assertSpyCalls(mockRun, 1);
  assertSpyCall(mockRun, 0, {
    args: [
      [
        "ffmpeg",
        "-y",
        "-framerate",
        "10",
        "-pattern_type",
        "glob",
        "-i",
        "video/images",
        "-c:v",
        "libx264",
        "-profile:v",
        "high",
        "-crf",
        "20",
        "-pix_fmt",
        "yuv420p",
        "path/to/video",
      ],
    ],
  });

  mockEnv.restore();
});
