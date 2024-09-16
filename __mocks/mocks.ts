import * as Simple from "run_simple";
import { spy } from "jsr:@std/testing/mock";

export const mockRun = spy(
  async (
    command: string | Simple.SimpleValue[],
    _options?: Simple.RunOptions,
  ) => await (command as string[]).join(""),
);
