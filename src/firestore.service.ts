import { Injectable, Logger } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';

@Injectable()
export class FirestoreService {
  private readonly logger = new Logger(FirestoreService.name);

  async storeData(id: string, data: any) {
    try {
      const db = new Firestore();
      const predictCollection = db.collection('prediction');
      await predictCollection.doc(id).set(data);
      this.logger.log(`Data with ID ${id} stored successfully`);
    } catch (error) {
      this.logger.error(`Error storing data with ID ${id}: ${error.message}`);
      throw error;
    }
  }

  async getData() {
    try {
      const db = new Firestore();

      const snapshot = await db.collection('prediction').get();
      if (snapshot.empty) {
        this.logger.warn('No data found in the prediction collection');
        return [];
      }
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        history: doc.data(),
      }));
    } catch (error) {
      this.logger.error(`Error fetching all data: ${error.message}`);
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  }
}
