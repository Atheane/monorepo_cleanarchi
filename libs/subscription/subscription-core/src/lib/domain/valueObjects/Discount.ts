import { CustomerType } from '@oney/subscription-messages';
import * as moment from 'moment';
import { DiscountType, DurationType } from '@oney/subscription-core';
import { isBetween } from '@oney/common-core';
import { ValueObject } from '@oney/ddd';
import { Duration } from '../types/Duration';
import { Price } from './Price';

interface DiscountProps {
  type: DiscountType;
  value: number;
  cumulative: boolean;
  occasion: string;
  duration: Duration;
  customerTypes: CustomerType[];
  price: Price;
}

export class Discount extends ValueObject<DiscountProps> {
  private readonly _amount: number;

  constructor(props: DiscountProps) {
    if (props.type === DiscountType.RATE && props.value < 0 && props.value > 1) {
      throw new Error('DISCOUNT_RATE_INVALID');
    }
    if (props.type === DiscountType.FIXED_PRICE && props.value < 0) {
      throw new Error('DISCOUNT_FIXED_PRICE_INVALID');
    }
    super(props);
    this._amount = this.calculate();
  }

  private calculate(): number {
    const price = this.props.price.amount;
    if (this.props.type === DiscountType.FIXED_PRICE) {
      return price - this.props.value;
    }
    return price * (1 - this.props.value);
  }

  isActive(): boolean {
    if (this.props.duration.type === DurationType.FIXED) {
      const { until, from } = this.props.duration;
      const startDate = moment(from).toDate();
      const endDate = moment(until).toDate();
      return isBetween(startDate, endDate);
    }
    return true;
  }

  get amount() {
    return this._amount;
  }

  get cumulative() {
    return this.props.cumulative;
  }
}
