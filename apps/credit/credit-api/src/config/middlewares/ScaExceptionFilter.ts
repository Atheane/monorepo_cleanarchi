import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AuthentifiedRequest } from '@oney/credit-core';
import { ScaException } from '../exceptions/ScaException';
import { getKernelDependencies } from '../Setup';

@Catch(HttpException)
export class ScaExceptionFilter implements ExceptionFilter {
  async catch(exception: ScaException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<AuthentifiedRequest>();
    try {
      const e = exception.cause;
      if (exception?.cause?.action) {
        const result = await getKernelDependencies().requestSca.execute({
          action: e.action,
          identity: request.user,
        });
        response.setHeader('sca_token', result.scaToken);
        delete result.scaToken;
        return response.status(HttpStatus.FORBIDDEN).send(result);
      }
      return response.status(400).send({
        error: exception,
      });
    } catch (e) {
      return response.status(400).send({
        error: e,
      });
    }
  }
}
