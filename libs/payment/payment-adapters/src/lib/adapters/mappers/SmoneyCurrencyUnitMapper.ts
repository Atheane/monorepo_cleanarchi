import { Mapper } from '@oney/common-core';
import { injectable } from 'inversify';

@injectable()
export class SmoneyCurrencyUnitMapper implements Mapper<number, number> {
  private fixedDecimalDigits = 2;
  private convertorEurosCents = 100;

  toDomain(cents: number): number {
    return parseFloat((cents / this.convertorEurosCents).toFixed(this.fixedDecimalDigits));
  }

  fromDomain(euros: number): number {
    return euros * this.convertorEurosCents;
  }
}
