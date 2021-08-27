import { injectable } from 'inversify';
import { NextFunction, Response } from 'express';
import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';
import { DomainError } from '@oney/common-core';
import { RequestScaVerifier, ScaErrors } from '@oney/identity-core';
import { AuthentifiedRequest } from '@oney/common-adapters';
import { FORBIDDEN } from 'http-status';

@Middleware({ type: 'after' })
@injectable()
export class ScaMiddleware implements ExpressErrorMiddlewareInterface {
  constructor(private readonly _requestScaVerifier: RequestScaVerifier) {}

  private isScaError(err: Error): boolean {
    return (
      err instanceof ScaErrors.ScaVerifierActionAlreadyConsumed ||
      err instanceof ScaErrors.ScaVerifierNotValid ||
      err instanceof ScaErrors.ScaDefaultVerifierError ||
      err instanceof ScaErrors.ScaRequired ||
      err instanceof ScaErrors.ScaRequestError
    );
  }

  async error(err: DomainError, req: AuthentifiedRequest, res: Response, next: NextFunction) {
    if (!this.isScaError(err)) {
      return next(err);
    }

    try {
      const cause = err.cause;
      if (cause) {
        const result = await this._requestScaVerifier.execute({
          action: cause.action,
          identity: req.user,
        });
        res.setHeader('sca_token', result.scaToken);
        delete result.scaToken;
        return res.status(FORBIDDEN).send(result);
      }
    } catch (e) {
      next(e);
    }
  }
}
