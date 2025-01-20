import { calculateShutterSpeed } from "../lib/utils.ts";

// Generate data points
const points: [number, number][] = [];
const MAX_BRIGHTNESS = 50000;
const MIN_BRIGHTNESS = 325;

// Generate points between MIN and MAX brightness using logarithmic scale
for (let i = 0; i <= 1000; i++) {
  // Map i to a value between MIN and MAX using exponential distribution
  const x = Math.exp(
    Math.log(MIN_BRIGHTNESS) +
      (Math.log(MAX_BRIGHTNESS) - Math.log(MIN_BRIGHTNESS)) * (i / 1000),
  );
  const brightness = Math.round(x);

  // Only include points within our range
  if (brightness >= MIN_BRIGHTNESS && brightness <= MAX_BRIGHTNESS) {
    const shutterSpeed = calculateShutterSpeed(brightness);
    points.push([brightness, shutterSpeed]);
  }
}

// Output as CSV
console.log("brightness,shutter_speed");
points.forEach(([b, s]) => console.log(`${b},${s}`));
