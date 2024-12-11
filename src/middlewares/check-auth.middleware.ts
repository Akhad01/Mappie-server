import { NestMiddleware, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export class CheckAuthMiddleware implements NestMiddleware {
  use(req: any, res: any, next: (error?: any) => void): any {
    const bearer = req.headers.authorization;
    const token = bearer?.split(' ')?.[1];
    if (token) {
      try {
        req.user = jwt.verify(token, process.env.ACCESS_SECRET);
      } catch (e) {
        console.log(e);
      }
    }
    next();
  }
}