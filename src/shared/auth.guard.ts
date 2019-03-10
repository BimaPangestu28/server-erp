import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    request.user = await this.validateRequest(request.headers.authorization);

    return true;
  }

  async validateRequest(request: string) {
    if (!request || request.split(' ')[0] !== 'Bearer') {
      throw new HttpException('Invalid Authorization!', HttpStatus.FORBIDDEN);
    }

    const token = request.split(' ')[1];

    try {
      const decode = jwt.verify(token, process.env.SECRET_KEY);

      return decode;
    } catch (error) {
      const message = `Invalid verify token: ${error.message || error.name}`;

      throw new HttpException(message, HttpStatus.FORBIDDEN);
    }
  }
}
