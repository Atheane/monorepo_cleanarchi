import { Mapper } from '@oney/common-core';
import { Debt } from '@oney/payment-core';
import { injectable } from 'inversify';
import { DebtDTO } from '../dto/DebtDTO';

@injectable()
export class DebtMapper implements Mapper<Debt, DebtDTO> {
  fromDomain(raw: Debt): DebtDTO {
    return { ...raw.props };
  }
}
