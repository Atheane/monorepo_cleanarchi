import { Entity } from '@oney/ddd';

export interface BeneficiaryProperties {
  id: string;

  bic: string;

  email: string;

  name: string;

  status: number;

  iban: string;
}

export class Beneficiary extends Entity<BeneficiaryProperties> {
  props: BeneficiaryProperties;

  constructor(props: BeneficiaryProperties) {
    super(props.id);
    this.props = props;
  }
}
