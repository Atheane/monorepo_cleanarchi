import { Response } from 'express';
import * as httpStatus from 'http-status';
import { injectable } from 'inversify';
import { Post, JsonController, Body, Res, QueryParams, Get } from 'routing-controllers';
import { GetCustomerServiceTopics, SendDemandToCustomerService } from '@oney/profile-core';
import { CustomerServiceCommand } from './command/CustomerServiceCommand';
import { GetTopicsCommand } from './command/GetTopicsCommand';

@JsonController('/customer-service')
@injectable()
export class CustomerServiceController {
  constructor(
    private readonly _sendDemandToCustomerService: SendDemandToCustomerService,
    private readonly _getCustomerServiceTopics: GetCustomerServiceTopics,
  ) {}

  @Post()
  async sendDemandToCustomerService(@Res() res: Response, @Body() cmd: CustomerServiceCommand) {
    const body = CustomerServiceCommand.setProperties(cmd);
    const isSent = await this._sendDemandToCustomerService.execute(body);
    return res.status(httpStatus.OK).send({
      isSent,
    });
  }

  @Get('/topics')
  async getCustomerServiceTopics(@Res() res: Response, @QueryParams() query: GetTopicsCommand) {
    const { versionNumber } = GetTopicsCommand.setProperties(query);
    const document = await this._getCustomerServiceTopics.execute({
      versionNumber,
    });

    res.set('Content-Type', 'application/json');
    return res.status(httpStatus.OK).send(document);
  }
}
