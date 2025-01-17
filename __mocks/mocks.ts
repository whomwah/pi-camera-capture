import { spy } from "jsr:@std/testing/mock";

export const mockRun = spy(
  async (
    cmd1: string[],
    cmd2?: string[],
  ) => await [...cmd1, ...(cmd2 ?? [])].join(""),
);
