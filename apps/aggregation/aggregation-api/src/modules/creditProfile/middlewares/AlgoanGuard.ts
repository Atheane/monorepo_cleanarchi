import { AggregationIdentifier, IAppConfiguration } from '@oney/aggregation-core';
import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { ExpressMiddlewareInterface } from 'routing-controllers';

@injectable()
export class AlgoanGuard implements ExpressMiddlewareInterface {
  constructor(
    @inject(AggregationIdentifier.appConfiguration) private readonly appConfiguration: IAppConfiguration,
  ) {}

  use(req: Request, res: Response, next: Function): Function {
    const {
      subscription: { id },
    } = req.body;
    if (id !== this.appConfiguration.algoanConfig.restHookId) {
      res.status(401).send('Unauthorized');
    }
    return next();
  }
}
