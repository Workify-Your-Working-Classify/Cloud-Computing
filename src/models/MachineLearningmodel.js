const tf = require('@tensorflow/tfjs-node');
const path = require('path');

const modelPath = path.join(__dirname, 'Model_V1.h5');
let model;

async function loadModel() {
  model = await tf.loadLayersModel(`file://${modelPath}`);
  console.log('Model loaded successfully');
}

async function predict(inputData) {
  if (!model) {
    await loadModel();
  }

  const inputTensor = tf.tensor2d(inputData, [inputData.length, inputData[0].length]);
  const predictions = model.predict(inputTensor);
  return predictions.arraySync();
}

module.exports = {
  loadModel,
  predict
};
