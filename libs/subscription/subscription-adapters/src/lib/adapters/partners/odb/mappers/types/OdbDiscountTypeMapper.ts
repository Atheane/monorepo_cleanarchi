import { Mapper } from '@oney/common-core';
import { injectable } from 'inversify';
import { DiscountType, SubscriptionErrors } from '@oney/subscription-core';

@injectable()
export class OdbDiscountTypeMapper implements Mapper<DiscountType> {
  toDomain(discountType: string): DiscountType {
    switch (discountType) {
      case 'FIXED_PRICE':
        return DiscountType.FIXED_PRICE;
      case 'RATE':
        return DiscountType.RATE;
      default:
        throw new SubscriptionErrors.InvalidDiscountType('DISCOUNT_TYPE_INVALID', {
          cause: `received value : ${discountType}`,
        });
    }
  }
}
