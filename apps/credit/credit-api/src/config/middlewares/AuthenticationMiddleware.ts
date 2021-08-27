import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Identity } from '@oney/identity-core';
import { getKernelDependencies } from '../Setup';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  use(req: Request & { user: Identity }, res: Response, next: NextFunction): void {
    getKernelDependencies().expressAuthenticationMiddleware.use(req, res, next);
  }
}
