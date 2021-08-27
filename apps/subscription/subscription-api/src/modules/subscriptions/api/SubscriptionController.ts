import { inject, injectable } from 'inversify';
import { Body, Get, JsonController, Param, Post, Req, Res, UseBefore, Delete } from 'routing-controllers';
import { AuthentifiedRequest, ExpressAuthenticationMiddleware } from '@oney/common-adapters';
import {
  CancelSubscriptionByOfferId,
  GetSubscriptionsBySubscriberId,
  SubscribeToOffer,
} from '@oney/subscription-core';
import { Response } from 'express';
import * as httpStatus from 'http-status';
import { SubscribeToOfferCommand } from './commands/SubscribeToOfferCommand';
import { SubscriptionResponseMapper } from './dto/SubscriptionResponseMapper';
import { SubscriptionSyms } from '../../../config/di/SubscriptionSyms';

@injectable()
@JsonController('')
@UseBefore(ExpressAuthenticationMiddleware)
export class SubscriptionController {
  constructor(
    private readonly _createSubscription: SubscribeToOffer,
    @inject(SubscriptionSyms.defaultOffer) private readonly _defaultOffer: string,
    private readonly _getSubscriptionBySubscriberId: GetSubscriptionsBySubscriberId,
    private readonly _subscriptionResponseMapper: SubscriptionResponseMapper,
    private readonly _cancelSubscriptionByOfferId: CancelSubscriptionByOfferId,
  ) {}

  @Post('')
  async subscribeToOffer(
    @Req() req: AuthentifiedRequest,
    @Res() res: Response,
    @Body() cmd: SubscribeToOfferCommand,
  ) {
    const body = SubscribeToOfferCommand.setProperties(cmd);
    const result = await this._createSubscription.execute({
      subscriberId: body.uid,
      offerId: body.offerId || this._defaultOffer,
    });
    return res.status(httpStatus.CREATED).send(this._subscriptionResponseMapper.fromDomain(result));
  }

  @Get('/:uid')
  async getSubscriptionBySubscriberId(
    @Req() req: AuthentifiedRequest,
    @Res() res: Response,
    @Param('uid') uid: string,
  ) {
    const isAuthorize = await this._getSubscriptionBySubscriberId.canExecute(req.user, {
      subscriberId: uid,
    });
    if (!isAuthorize) {
      return res.sendStatus(401);
    }
    const result = await this._getSubscriptionBySubscriberId.execute({
      subscriberId: uid,
    });
    return res
      .status(httpStatus.OK)
      .send(result.map(item => this._subscriptionResponseMapper.fromDomain(item)));
  }

  @Delete('/:uid/:offerId')
  async cancelSubscriptionByOfferId(
    @Req() req: AuthentifiedRequest,
    @Res() res: Response,
    @Param('uid') uid: string,
    @Param('offerId') offerId: string,
  ) {
    const isAuthorize = await this._cancelSubscriptionByOfferId.canExecute(req.user, {
      offerId,
      subscriberId: uid,
    });
    if (!isAuthorize) {
      return res.sendStatus(401);
    }
    const result = await this._cancelSubscriptionByOfferId.execute({
      subscriberId: uid,
      offerId,
    });
    return res.status(httpStatus.OK).send(this._subscriptionResponseMapper.fromDomain(result));
  }
}
