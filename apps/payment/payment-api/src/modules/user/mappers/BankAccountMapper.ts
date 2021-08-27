import { Mapper } from '@oney/common-core';
import { BankAccount, Beneficiary, Card, Debt, UncappingState } from '@oney/payment-core';
import { injectable } from 'inversify';
import { CardMapper } from './CardMapper';
import { DebtMapper } from './DebtMapper';
import { BeneficiaryMapper } from './BeneficiaryMapper';
import { BankAccountDTO } from '../dto/BankAccountDTO';
import { CardDTO } from '../dto/CardDTO';
import { BeneficiaryDTO } from '../dto/BeneficiaryDTO';
import { DebtDTO } from '../dto/DebtDTO';

@injectable()
export class BankAccountMapper implements Mapper<BankAccount> {
  constructor(
    private readonly bankMapper: CardMapper,
    private readonly debtMapper: DebtMapper,
    private readonly beneficiaryMapper: BeneficiaryMapper,
  ) {}
  fromDomain(raw: BankAccount): BankAccountDTO {
    const { props: bankAccountProps } = raw;
    const { uid, iban, bic, bankAccountId, uncappingState, productsEligibility } = bankAccountProps;
    const bankAccountDTO: BankAccountDTO = {
      uid,
      iban,
      bic,
      bankAccountId,
      cards: this.fromDomainCards(bankAccountProps.cards),
      debts: this.fromDomainDebts(bankAccountProps.debts),
      beneficiaries: this.fromDomainBeneficiaries(bankAccountProps.beneficiaries),
      uncappingState,
      isUncapped: uncappingState === UncappingState.UNCAPPED,
      productsEligibility,
    };

    if (raw.hasMonthlyAllowance()) {
      bankAccountDTO.monthlyAllowance = bankAccountProps.monthlyAllowance;
    }

    if (raw.hasKycDiligenceStatus()) {
      bankAccountDTO.kycDiligenceStatus = bankAccountProps.kycDiligenceStatus;
    }

    if (raw.props.kycDiligenceValidationMethod) {
      bankAccountDTO.kycDiligenceValidationMethod = bankAccountProps.kycDiligenceValidationMethod;
    }

    if (raw.hasLimits()) {
      bankAccountDTO.limits = bankAccountProps.limits.props;
    }

    return bankAccountDTO;
  }

  fromDomainCards(cards: Card[]): CardDTO[] {
    return cards.map(card => this.bankMapper.fromDomain(card));
  }
  fromDomainDebts(debts: Debt[]): DebtDTO[] {
    return debts.map(debt => this.debtMapper.fromDomain(debt));
  }

  fromDomainBeneficiaries(beneficiary: Beneficiary[]): BeneficiaryDTO[] {
    return beneficiary.map(beneficiary => this.beneficiaryMapper.fromDomain(beneficiary));
  }
}
