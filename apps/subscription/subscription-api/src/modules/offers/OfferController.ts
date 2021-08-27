import { injectable } from 'inversify';
import { Get, JsonController, Param, Res, UseBefore } from 'routing-controllers';
import { ExpressAuthenticationMiddleware } from '@oney/common-adapters';
import { GetOffers, SubscriptionErrors } from '@oney/subscription-core';
import { Response } from 'express';
import * as httpStatus from 'http-status';
import { OfferCategory } from '@oney/subscription-messages';
import { OfferDto } from './dto/OfferDto';

@injectable()
@JsonController('/offers')
@UseBefore(ExpressAuthenticationMiddleware)
export class OfferController {
  constructor(private readonly _getOffer: GetOffers) {}

  @Get('/')
  async getOffers(@Res() res: Response) {
    const offerDto = new OfferDto();
    const result = await this._getOffer.execute();
    const filteredOffers = result.filter(offer => offer.props.category !== OfferCategory.STANDALONE);
    return res.status(httpStatus.OK).send(filteredOffers.map(item => offerDto.fromDomain(item)));
  }

  @Get('/:offerId')
  async getOfferById(@Res() res: Response, @Param('offerId') offerId: string) {
    const offerDto = new OfferDto();
    const result = await this._getOffer.execute();
    const offer = result.find(item => item.id === offerId);
    if (!offer) {
      return res.status(httpStatus.NOT_FOUND).send({
        error: SubscriptionErrors.OfferNotFound.name,
      });
    }
    return res.status(httpStatus.OK).send(offerDto.fromDomain(offer));
  }
}
