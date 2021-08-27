import { injectable } from 'inversify';
import { JsonController, Post, UseBefore, Res, Body, Req } from 'routing-controllers';
import { Response } from 'express';
import { ExpressAuthenticationMiddleware } from '@oney/common-adapters';
import { OrderRaisingLimits } from '@oney/payment-core';
import { StartRaisingLimitsWorkflow } from './StartRaisingLimitsWorkflow';
import { AuthentifiedRequest } from '../../../../server/config/middlewares/types/AuthentifiedRequest';

@JsonController('/account/:accountId/limits')
@UseBefore(ExpressAuthenticationMiddleware)
@injectable()
export class LimitsController {
  constructor(private readonly orderRaisingLimits: OrderRaisingLimits) {}

  @Post('/raising-order')
  async expandLimits(
    @Req() req: AuthentifiedRequest,
    @Body() body: StartRaisingLimitsWorkflow,
    @Res() res: Response,
  ) {
    const { uid } = StartRaisingLimitsWorkflow.setProperties(body);
    await this.orderRaisingLimits.execute({ uid });
    return res.status(200).send();
  }
}
