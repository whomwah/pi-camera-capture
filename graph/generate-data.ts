import { calculateShutterSpeed, MAX_BRIGHTNESS, MIN_BRIGHTNESS } from "../lib/utils.ts";

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

  // Shuffle the points array using Fisher-Yates algorithm
  // for (let i = points.length - 1; i > 0; i--) {
  //   const j = Math.floor(Math.random() * (i + 1));
  //   [points[i], points[j]] = [points[j], points[i]];
  // }

  // Output as CSV
  console.log("brightness,shutter_speed");
  points.forEach(([brightness, shutterSpeed]) =>
    console.log(`${brightness},${shutterSpeed}`)
  );
}

if (import.meta.main) {
  generateData();
}
