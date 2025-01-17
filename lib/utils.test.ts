import { assertEquals } from "jsr:@std/assert";
import { calculateShutterSpeed, env, getFormattedDate } from "./utils.ts";

Deno.test("getFormattedDate returns correct dateString and iso", () => {
  // Save the original Date constructor
  const OriginalDate = Date;

  // Mock Date constructor
  const mockDate = new Date("2023-01-01T00:00:00Z");
  globalThis.Date = class extends Date {
    constructor() {
      super();
      return mockDate;
    }
  } as DateConstructor;

  try {
    const { dateString, iso } = getFormattedDate();
    const expectedIso = mockDate.toISOString();
    const expectedDateString = expectedIso.slice(0, 10);

    assertEquals(dateString, expectedDateString);
    assertEquals(iso, expectedIso);
  } finally {
    // Restore the original Date constructor
    globalThis.Date = OriginalDate;
  }
});

Deno.test("env returns the correct environment variable value", () => {
  // Mock Deno.env.get
  const originalEnvGet = Deno.env.get;
  Deno.env.get = (name: string) => {
    if (name === "TEST_ENV_VAR") {
      return "test_value";
    }
    return undefined;
  };

  try {
    const value = env("TEST_ENV_VAR");
    assertEquals(value, "test_value");

    const undefinedValue = env("UNDEFINED_ENV_VAR");
    assertEquals(undefinedValue, "");
  } finally {
    // Restore the original Deno.env.get
    Deno.env.get = originalEnvGet;
  }
});

Deno.test("calculateShutterSpeed", () => {
  // the results in the assertions is the value passed to --shutter
  assertEquals(calculateShutterSpeed(89285.1), 36700);
  assertEquals(calculateShutterSpeed(59285.1), 55271);
  assertEquals(calculateShutterSpeed(49285.1), 66486);
  assertEquals(calculateShutterSpeed(29285.1), 111891);
  assertEquals(calculateShutterSpeed(29206.5), 112192);
  assertEquals(calculateShutterSpeed(29149.4), 112412);
  assertEquals(calculateShutterSpeed(1234.3), 200000);
});
