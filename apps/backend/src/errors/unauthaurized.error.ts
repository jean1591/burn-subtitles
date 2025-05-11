import { HttpException, HttpStatus } from '@nestjs/common';

export class UnauthorizedError extends HttpException {
  constructor(message: string) {
    super(
      {
        status: 'error',
        message,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
