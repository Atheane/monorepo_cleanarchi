import { CustomerType, OfferCategory, OfferRef, OfferType, Periodicity } from '@oney/subscription-messages';
import { AggregateRoot } from '@oney/ddd';
import { Incentive } from '../valueObjects/Incentive';
import { CardOffer } from '../valueObjects/CardOffer';
import { Insurance } from '../valueObjects/Insurance';
import { Discount } from '../valueObjects/Discount';
import { Price } from '../../..';

export interface OfferProperties {
  id: string;
  name: string;
  description: string;
  category: OfferCategory;
  ref: OfferRef;
  type: OfferType;
  price: Price;
  freeWithdrawal: number;
  periodicity: Periodicity;
  offersIncentives: Incentive[];
  card: CardOffer;
  insurances: Insurance[];
  discounts: Discount[];
}

export class Offer extends AggregateRoot<OfferProperties> {
  props: OfferProperties;

  constructor(props: OfferProperties) {
    super(props.id);
    this.props = props;
  }

  discountPrice(customerType: CustomerType): Price {
    const { discounts } = this.props;
    const customerDiscounts = discounts.filter(
      item => item.props.customerTypes.includes(customerType) && item.isActive(),
    );
    if (customerDiscounts.length <= 0) {
      return this.props.price;
    }
    const isNonCumulativeDiscount = customerDiscounts.find(item => !item.cumulative);
    if (isNonCumulativeDiscount) {
      return new Price(isNonCumulativeDiscount.amount);
    }
    const calculatedDiscount = customerDiscounts.map(item => item.amount).reduce((a, b) => a + b);
    return new Price(calculatedDiscount);
  }
}
