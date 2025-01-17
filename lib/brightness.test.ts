import { assertSpyCall, assertSpyCalls, stub } from "jsr:@std/testing/mock";
import { calcBrightness } from "./brightness.ts";
import { mockRun } from "../__mocks/mocks.ts";

Deno.test("takeSnapshot calls run with correct arguments", async () => {
  const mockEnv = stub(Deno.env, "get", () => "snapshot");

  await calcBrightness(mockRun, 0.5);

  assertSpyCalls(mockRun, 1);
  assertSpyCall(mockRun, 0, {
    args: [
      [
        "snapshot",
        "--immediate",
        "--width",
        "800",
        "--height",
        "600",
        "--shutter",
        "50000",
        "-o",
        "-",
      ],
      [
        "snapshot",
        "jpeg:-",
        "-colorspace",
        "Gray",
        "-format",
        "%[fx:quantumrange*mean]",
        "info:",
      ],
    ],
  });

  mockEnv.restore();
});
