import { Mapper } from '@oney/common-core';
import { injectable } from 'inversify';
import { Discount, Offer, Price } from '@oney/subscription-core';
import { OdbPeriodicityMapper } from './types/OdbPeriodicityMapper';
import { OdbDiscountTypeMapper } from './types/OdbDiscountTypeMapper';

@injectable()
export class OdbOfferMapper implements Mapper<Offer> {
  constructor(
    private readonly _periodicityMapper: OdbPeriodicityMapper,
    private readonly _odbDiscountTypeMapper: OdbDiscountTypeMapper,
  ) {}

  toDomain(offer: any): Offer {
    const price = new Price(offer.price);
    return new Offer({
      id: offer.id,
      name: offer.name,
      type: offer.type,
      ref: offer.ref,
      periodicity: this._periodicityMapper.toDomain(offer.periodicity),
      price: price,
      category: offer.category,
      description: offer.description,
      freeWithdrawal: offer.freeWithdrawal,
      ...(offer.card && {
        card: {
          type: offer.card.cardType,
          img: offer.card.cardImg,
          blocked: offer.card.blocked,
          ...offer.card,
        },
      }),
      ...(offer.discounts && {
        discounts: offer.discounts.map(discount => {
          return new Discount({
            type: this._odbDiscountTypeMapper.toDomain(discount.discountValue.type),
            value: discount.discountValue.value,
            cumulative: discount.cumulative,
            occasion: discount.discountName,
            duration: {
              type: discount.discountApplicationRules.duration,
              from: discount.discountApplicationRules.campaignStart,
              until: discount.discountApplicationRules.campaignEnd,
            },
            customerTypes: discount.discountApplicationRules.matchingCustomerType,
            price: price,
          });
        }),
      }),
      ...(offer.insurances && {
        insurances: offer.insurances.map(insurance => {
          return {
            title: insurance.title,
            name: insurance.name,
            detail: insurance.detail,
            warranties: insurance.warranties.map(warranty => {
              return {
                icon: warranty.icon,
                title: warranty.title,
                name: warranty.name,
                exclusivity: warranty.exclusivity,
              };
            }),
          };
        }),
      }),
      offersIncentives: offer.offersIncentives,
    });
  }
}
