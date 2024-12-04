import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl"; // Or '@tensorflow/tfjs-backend-cpu'

export const initializeBackend = async () => {
  if (!tf.engine().backendName) {
    await tf.setBackend("webgl"); // Use 'cpu' or 'wasm' if preferred
    await tf.ready();
    console.log(`Backend initialized: ${tf.getBackend()}`);
  }
};
