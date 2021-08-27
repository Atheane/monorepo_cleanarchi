import { Entity } from '@oney/ddd';
import { LegacyBankAccountBeneficiary } from '../types/LegacyBankAccountBeneficiary';
import { LegacyCard } from '../types/LegacyCard';

export interface LegacyBankAccountProperties {
  uid: string;
  bid: string;
  iban: string;
  bic: string;
  cards: LegacyCard[];
  beneficiary: LegacyBankAccountBeneficiary[];
}

export class LegacyBankAccount extends Entity<LegacyBankAccountProperties> {
  public props: LegacyBankAccountProperties;

  constructor(props: LegacyBankAccountProperties) {
    super(props.uid);

    this.props = { ...props };
  }
}
