import {
  BadRequestException,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('predict')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 1000000 },
    }),
  )
  async predict(@UploadedFile() file) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      return await this.appService.predict(file.buffer);
    } catch (error) {
      throw new BadRequestException(
        'Terjadi kesalahan dalam melakukan prediksi',
      );
    }
  }

  @Get('/predict/histories')
  async getAllPredictionHistories() {
    try {
      return await this.appService.getAllPredictionHistories();
    } catch (error) {
      throw new BadRequestException(
        'Terjadi kesalahan dalam mengambil data prediksi',
      );
    }
  }
}
