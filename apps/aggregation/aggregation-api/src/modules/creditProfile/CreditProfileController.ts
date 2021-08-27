import { SendUserRevenueDataToUpcapLimit } from '@oney/aggregation-core';
import { AlgoanEvents } from '@oney/algoan';
import { Response } from 'express';
import * as httpStatus from 'http-status';
import { injectable } from 'inversify';
import { Post, JsonController, Res, Body, UseBefore } from 'routing-controllers';
import { CreditProfileCalculatedCommand } from './commands';
import { AlgoanGuard } from './middlewares/AlgoanGuard';

@JsonController('/scoring_analysis_completed')
@UseBefore(AlgoanGuard)
@injectable()
export class CreditProfileController {
  constructor(private readonly _sendUserRevenueDataToUpcapLimit: SendUserRevenueDataToUpcapLimit) {}

  @Post('/')
  async sendUserRevenueDataToUpcapLimit(
    @Body() cmd: CreditProfileCalculatedCommand,
    @Res() res: Response,
  ): Promise<Response> {
    const {
      subscription: { eventName },
      payload: { banksUserId },
    } = CreditProfileCalculatedCommand.setProperties(cmd);
    if (eventName === AlgoanEvents.ADEN_ANALYSIS_COMPLETED) {
      await this._sendUserRevenueDataToUpcapLimit.execute({ banksUserId });
      return res.status(httpStatus.OK).send({
        banksUserId,
      });
    }
    return res.status(httpStatus.BAD_REQUEST).send({
      banksUserId,
    });
  }
}
