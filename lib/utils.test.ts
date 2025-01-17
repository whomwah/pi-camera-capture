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

Deno.test("calculateShutterSpeed comprehensive tests", () => {
  // Bright conditions (>30% brightness)
  // 65535 = 100%, expect minimum shutter speed
  assertEquals(calculateShutterSpeed(65535), 50000);
  assertEquals(calculateShutterSpeed(49151), 66667); // 75%
  assertEquals(calculateShutterSpeed(32767), 100002); // 50%

  assertEquals(calculateShutterSpeed(31000), 105702);
  assertEquals(calculateShutterSpeed(30000), 109225);
  assertEquals(calculateShutterSpeed(29000), 112991);
  assertEquals(calculateShutterSpeed(28000), 117027);
  assertEquals(calculateShutterSpeed(27000), 121361);
  assertEquals(calculateShutterSpeed(26000), 126029);
  assertEquals(calculateShutterSpeed(25660), 127699);
  assertEquals(calculateShutterSpeed(24000), 136531);
  assertEquals(calculateShutterSpeed(23000), 142467);
  assertEquals(calculateShutterSpeed(22000), 148943);
  assertEquals(calculateShutterSpeed(21000), 156036);

  // Dark conditions (<30% brightness)
  assertEquals(calculateShutterSpeed(20000), 163838);
  assertEquals(calculateShutterSpeed(19000), 198321);
  assertEquals(calculateShutterSpeed(17000), 338384);
  assertEquals(calculateShutterSpeed(16000), 444230);
  assertEquals(calculateShutterSpeed(15000), 585471);
  assertEquals(calculateShutterSpeed(14000), 775062);
  assertEquals(calculateShutterSpeed(13500), 893440);
  assertEquals(calculateShutterSpeed(13107), 1000000); // 20%
  assertEquals(calculateShutterSpeed(6553), 5000000); // 10%
  assertEquals(calculateShutterSpeed(3276), 5000000); // 5%
  assertEquals(calculateShutterSpeed(325), 5000000); // pitch back

  // Test with adjustment parameter
  assertEquals(calculateShutterSpeed(32767, 1.5), 150002); // 50% with 1.5x adjustment
  assertEquals(calculateShutterSpeed(32767, 0.5), 50001); // 50% with 0.5x adjustment

  // Edge cases
  assertEquals(calculateShutterSpeed(65535, 0), 100); // Max brightness, min adjustment
  assertEquals(calculateShutterSpeed(1, 1.0), 5000000); // Near-zero brightness
  assertEquals(calculateShutterSpeed(0, 1.0), 5000000); // Zero brightness
});
