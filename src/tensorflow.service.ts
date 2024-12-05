import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as tf from '@tensorflow/tfjs-node';

@Injectable()
export class TensorflowService implements OnModuleInit {
  private model: tf.GraphModel | null = null;
  private readonly logger = new Logger(TensorflowService.name);

  async onModuleInit() {
    await this.loadModel();
  }

  async loadModel() {
    const modelUrl = process.env.MODEL_URL;
    if (!modelUrl) {
      throw new Error('MODEL_URL is not set in environment variables');
    }
    try {
      this.logger.log('Loading TensorFlow model...');
      this.model = await tf.loadGraphModel(modelUrl);
      this.logger.log('Model loaded successfully');
    } catch (error) {
      this.logger.error(`Failed to load model: ${error.message}`);
      throw error;
    }
  }

  async predict(imageBuffer) {
    if (!this.model) {
      throw new Error('Model is not loaded');
    }

    try {
      const tensor = tf.node
        .decodeJpeg(imageBuffer, 3)
        .resizeNearestNeighbor([224, 224])
        .expandDims()
        .toFloat();
      const predictions = (await this.model.predict(tensor)) as tf.Tensor;
      const resultArray = await predictions.array();

      const isCancer = resultArray[0][0] > 0.5;
      return isCancer ? 'Cancer' : 'Non-cancer';
    } catch (error) {
      this.logger.error(`Prediction error: ${error}`);
      throw error;
    }
  }
}
