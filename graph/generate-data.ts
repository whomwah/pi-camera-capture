import {
  calculateShutterSpeed,
  MAX_BRIGHTNESS,
  MIN_BRIGHTNESS,
} from "../lib/utils.ts";

export function generateData() {
  const points: [number, number][] = [];

  // Generate points for every brightness value
  for (
    let brightness = MIN_BRIGHTNESS;
    brightness <= MAX_BRIGHTNESS;
    brightness++
  ) {
    const shutterSpeed = calculateShutterSpeed(brightness);
    points.push([brightness, shutterSpeed]);
  }

  // Output as CSV
  console.log("brightness,shutter_speed");
  points.forEach(([brightness, shutterSpeed]) =>
    console.log(`${brightness},${shutterSpeed}`)
  );
}

if (import.meta.main) {
  generateData();
}
