import { Mapper } from '@oney/common-core';
import { Beneficiary, LegacyBankAccountBeneficiary } from '@oney/payment-core';

export class OdbBeneficiaryMapper implements Mapper<Beneficiary> {
  fromDomain(t: Beneficiary): LegacyBankAccountBeneficiary {
    return {
      bid: t.props.id,
      status: t.props.status,
      name: t.props.name,
      email: t.props.email,
      bic: t.props.bic,
      iban: t.props.iban,
    };
  }

  toDomain(raw: LegacyBankAccountBeneficiary): Beneficiary {
    return new Beneficiary({
      email: raw.email,
      name: raw.name,
      status: raw.status,
      id: raw.bid,
      bic: raw.bic,
      iban: raw.iban,
    });
  }
}
