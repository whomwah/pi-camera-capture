import {
  assertSpyCall,
  assertSpyCalls,
  returnsNext,
  stub,
} from "jsr:@std/testing/mock";
import { mockRun } from "../__mocks/mocks.ts";
import { syncSnapshot } from "./sync.ts";

Deno.test("sync calls run with correct arguments", async () => {
  const mockEnv = stub(
    Deno.env,
    "get",
    returnsNext(["sync", "s3-bucket-name"]),
  );
  const filePath = "path/images";

  await syncSnapshot(mockRun, filePath);

  assertSpyCalls(mockRun, 1);
  assertSpyCall(mockRun, 0, {
    args: [
      [
        "sync",
        "s3",
        "sync",
        "path/images/",
        "s3-bucket-name",
        "--exclude",
        "*",
        "--include",
        "*.jpg",
      ],
    ],
  });

  mockEnv.restore();
});
