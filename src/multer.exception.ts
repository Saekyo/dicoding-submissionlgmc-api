import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class MulterExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception.name == 'PayloadTooLargeException') {
      return response.status(HttpStatus.PAYLOAD_TOO_LARGE).json({
        status: 'fail',
        message: 'Payload content length greater than maximum allowed: 1000000',
      });
    }

    if (exception.status == 400) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        status: 'fail',
        message: 'Terjadi kesalahan dalam melakukan prediksi',
      });
    }

    return response.status(HttpStatus.BAD_REQUEST).json({
      status: 'fail',
      message: 'Terjadi kesalahan dalam melakukan prediksi',
    });
  }
}
