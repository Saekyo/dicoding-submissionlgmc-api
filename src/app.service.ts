import { BadRequestException, Injectable } from '@nestjs/common';
import { TensorflowService } from './tensorflow.service';
import { FirestoreService } from './firestore.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppService {
  constructor(
    private readonly tensorflowService: TensorflowService,
    private readonly firestoreService: FirestoreService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async predict(imageBuffer: Buffer) {
    try {
      const predictionResult =
        await this.tensorflowService.predict(imageBuffer);

      const isCancer = predictionResult === 'Cancer';
      const id = uuidv4();
      const result = {
        id,
        result: isCancer ? 'Cancer' : 'Non-cancer',
        suggestion: isCancer
          ? 'Segera periksa ke dokter!'
          : 'Penyakit kanker tidak terdeteksi.',
        createdAt: new Date().toISOString(),
      };

      // await this.firestoreService.storeData(id, result);

      return {
        status: 'success',
        message: 'Model is predicted successfully',
        data: result,
      };
    } catch (error) {
      throw new BadRequestException(
        'Terjadi kesalahan dalam melakukan prediksi',
      );
    }
  }

  async getAllPredictionHistories() {
    try {
      return await this.firestoreService.getData();
    } catch (error) {
      throw new BadRequestException(
        'Terjadi kesalahan dalam mengambil data prediksi',
      );
    }
  }
}
