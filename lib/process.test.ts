import { assertSpyCall, assertSpyCalls, stub } from "jsr:@std/testing/mock";
import { processSnapshot } from "./process.ts";
import { mockRun } from "../__mocks/mocks.ts";

Deno.test("processSnapshot calls run with correct arguments", async () => {
  const snapshotPath = "/path/to/snapshot.jpg";
  const mockEnv = stub(Deno.env, "get", () => "convert");
  const isoString = "2011-10-05T14:48:00.000Z";

  await processSnapshot(
    mockRun,
    snapshotPath,
    isoString,
  );

  assertSpyCalls(mockRun, 1);
  assertSpyCall(mockRun, 0, {
    args: [
      [
        "convert",
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
        isoString,
        snapshotPath,
      ],
    ],
  });

  mockEnv.restore();
});
