import { assertEquals } from "jsr:@std/assert";
import {
  calculateShutterSpeed,
  env,
  getFormattedDate,
  MAX_BRIGHTNESS,
  MIN_BRIGHTNESS,
} from "./utils.ts";

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

Deno.test("calculateShutterSpeed comprehensive tests", () => {
  assertEquals(calculateShutterSpeed(MAX_BRIGHTNESS), 20833);
  assertEquals(calculateShutterSpeed(50000), 31887);
  assertEquals(calculateShutterSpeed(40000), 65000);
  assertEquals(calculateShutterSpeed(30000), 86667);
  assertEquals(calculateShutterSpeed(25000), 104000);
  assertEquals(calculateShutterSpeed(24000), 108333);
  assertEquals(calculateShutterSpeed(23000), 113043);
  assertEquals(calculateShutterSpeed(22000), 118182);
  assertEquals(calculateShutterSpeed(21000), 123810);
  assertEquals(calculateShutterSpeed(20000), 130000);
  assertEquals(calculateShutterSpeed(10000), 260000);
  assertEquals(calculateShutterSpeed(5000), 520000);
  assertEquals(calculateShutterSpeed(1000), 2605600);
  assertEquals(calculateShutterSpeed(750), 3477467);
  assertEquals(calculateShutterSpeed(500), 5221200);
  assertEquals(calculateShutterSpeed(450), 5802444);
  assertEquals(calculateShutterSpeed(MIN_BRIGHTNESS), 6000000);
});
