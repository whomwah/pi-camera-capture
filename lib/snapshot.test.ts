import { assertSpyCall, assertSpyCalls, stub } from "jsr:@std/testing/mock";
import { takeSnapshot } from "./snapshot.ts";
import { mockRun } from "../__mocks/mocks.ts";

Deno.test("takeSnapshot calls run with correct arguments", async () => {
  const snapshotPath = "/path/to/snapshot.jpg";
  const mockEnv = stub(Deno.env, "get", () => "snapshot");

  await takeSnapshot(mockRun, snapshotPath);

  assertSpyCalls(mockRun, 1);
  assertSpyCall(mockRun, 0, {
    args: [
      [
        "snapshot",
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
      ],
    ],
  });

  mockEnv.restore();
});
