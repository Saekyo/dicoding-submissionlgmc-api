import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirestoreService } from './firestore.service';
import { TensorflowService } from './tensorflow.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, FirestoreService, TensorflowService],
})
export class AppModule {}
