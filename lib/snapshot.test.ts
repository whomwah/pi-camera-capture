import { assertSpyCall, assertSpyCalls, stub } from "jsr:@std/testing/mock";
import { takeSnapshot } from "./snapshot.ts";
import { mockRun } from "../__mocks/mocks.ts";

Deno.test("takeSnapshot calls run with correct arguments", async () => {
  const snapshotPath = "/path/to/snapshot.jpg";
  const mockEnv = stub(Deno.env, "get", () => "snapshot");

  await takeSnapshot({ run: mockRun, snapshotPath, quality: "50" });

  assertSpyCalls(mockRun, 1);
  assertSpyCall(mockRun, 0, {
    args: [
      [
        "snapshot",
        "-o",
        snapshotPath,
        "--immediate",
        "--width",
        "2664",
        "--height",
        "1980",
        "--quality",
        "50",
        "--shutter",
        "60000",
      ],
    ],
  });

  mockEnv.restore();
});
