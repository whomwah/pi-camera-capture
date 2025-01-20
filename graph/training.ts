import * as tf from "npm:@tensorflow/tfjs@^4.22.0";
import { parse } from "jsr:@std/csv";
import { MAX_BRIGHTNESS, MAX_SHUTTER, MIN_BRIGHTNESS, MIN_SHUTTER } from "../lib/utils.ts";

function normalizeLinear(value: number, min: number, max: number): number {
  return (value - min) / (max - min);
}

// Load CSV data
async function loadCsvData(filePath: string): Promise<{
  brightnessNormalized: number[];
  shutterSpeedNormalized: number[];
  brightnessMin: number;
  brightnessMax: number;
  shutterSpeedMin: number;
  shutterSpeedMax: number;
}> {
  const csvContent = await Deno.readTextFile(filePath);
  const rows = parse(csvContent);

  // Assuming CSV columns: brightness, shutter_speed
  const brightnessNormalized: number[] = [];
  const shutterSpeedNormalized: number[] = [];

  const brightnessMin = MIN_BRIGHTNESS;
  const brightnessMax = MAX_BRIGHTNESS;
  const shutterSpeedMin = MIN_SHUTTER;
  const shutterSpeedMax = MAX_SHUTTER;

  for (let i = 1; i < rows.length; i++) {
    // Parse numeric columns from rows
    brightnessNormalized.push(
      normalizeLinear(Number(rows[i][0]), brightnessMin, brightnessMax),
    );
    shutterSpeedNormalized.push(
      normalizeLinear(Number(rows[i][1]), shutterSpeedMin, shutterSpeedMax),
    );
  }

  return {
    brightnessNormalized,
    shutterSpeedNormalized,
    brightnessMin,
    brightnessMax,
    shutterSpeedMin,
    shutterSpeedMax,
  };
}

// Generate training data
const data = await loadCsvData("./graph/data.csv");
if (!data) {
  throw new Error("loadCsvData return undefined");
}

// Separate generated and known data instead of combining
const trainingInputs = data.brightnessNormalized;
const trainingLabels = data.shutterSpeedNormalized;

// Define a sequential model
const model = tf.sequential();

// First hidden layer with 64 units
model.add(
  tf.layers.dense({
    units: 64,
    activation: "relu",
    inputShape: [1],
    kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }),
  }),
);

// Dropout to prevent overfitting
model.add(tf.layers.dropout({ rate: 0.3 }));

// Second hidden layer with 128 units
model.add(
  tf.layers.dense({
    units: 128,
    activation: "relu",
    kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }),
  }),
);

// Another Dropout layer
model.add(tf.layers.dropout({ rate: 0.3 }));

// Third hidden layer with 64 units
model.add(
  tf.layers.dense({
    units: 64,
    activation: "relu",
    kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }),
  }),
);

// Output layer
model.add(tf.layers.dense({ units: 1 }));

// Compile the model
model.compile({
  optimizer: tf.train.adam(0.0001),
  loss: "meanSquaredError",
});

async function trainModel(
  model: tf.Sequential,
  xs: number[],
  ys: number[],
): Promise<void> {
  const inputs = tf.tensor2d(xs, [xs.length, 1]);
  const labels = tf.tensor2d(ys, [ys.length, 1]);

  let bestValidationLoss = Infinity;
  let bestModelWeights: tf.Tensor[] | null = null;

  // Add early stopping
  const earlyStoppingCallback = tf.callbacks.earlyStopping({
    monitor: "val_loss",
    patience: 50, // Increased patience
    minDelta: 0.00001, // Decreased minDelta for finer improvements
    verbose: 1,
    mode: "min",
  });

  const epochData: Array<{ epoch: number; loss: number; valLoss?: number }> =
    [];

  // Train the model
  await model.fit(inputs, labels, {
    epochs: 100,
    batchSize: 32,
    shuffle: false,
    verbose: 1,
    validationSplit: 0.2,
    callbacks: [
      earlyStoppingCallback,
      new tf.CustomCallback({
        onEpochEnd: (epoch: any, logs: any) => {
          if (logs && logs.val_loss < bestValidationLoss) {
            bestValidationLoss = logs.val_loss;
            bestModelWeights = model.getWeights();
          }
          if (logs && epoch % 10 === 0) {
            console.log(
              `Epoch ${
                epoch + 1
              }: Loss = ${logs.loss}, Val Loss = ${logs.val_loss}`,
            );
          }
          if (logs) {
            epochData.push({
              epoch: epoch + 1,
              loss: logs.loss ?? 0,
              valLoss: logs.val_loss,
            });
          }
        },
        onTrainEnd: async () => {
          // Overwrite file with epoch data
          await Deno.writeTextFile(
            "./graph/epoch_data.json",
            JSON.stringify(epochData, null, 2),
          );
        },
      }),
    ],
  });

  // Restore best weights
  if (bestModelWeights) {
    model.setWeights(bestModelWeights);
  }

  console.log("Training complete - Best validation loss:", bestValidationLoss);
}

// Train
await trainModel(model, trainingInputs, trainingLabels);

// Save best model
// await model.save("file://./best-model");

async function predict(model: tf.Sequential, input: number): Promise<number> {
  const normalizedInput = normalizeLinear(
    input,
    data.brightnessMin,
    data.brightnessMax,
  );
  const prediction = model.predict(
    tf.tensor2d([normalizedInput], [1, 1]),
  ) as tf.Tensor;
  const [predictedValue] = await prediction.data();

  return (
    predictedValue * (data.shutterSpeedMax - data.shutterSpeedMin) +
    data.shutterSpeedMin
  );
}

const brightnessValues = [
  325,
  10000,
  20000,
  30000,
  40000,
  50000,
  28204,
  34856,
  47759,
];

for (const brightness of brightnessValues) {
  const predictedShutterSpeed = await predict(model, brightness);
  console.log(
    `Predicted Shutter Speed for brightness ${brightness}:`,
    predictedShutterSpeed,
  );
}
