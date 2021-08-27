import { Mapper } from '@oney/common-core';
import { BankAccount, BankAccountProperties, LimitInformationProperties, Debt } from '@oney/payment-core';
import { injectable } from 'inversify';
import { OdbBeneficiaryMapper } from './OdbBeneficiaryMapper';
import { LegacyCardMapper } from './LegacyCardMapper';
import { LegacyBankAccount } from '../mongodb/models/legacy/LegacyBankAccount';

@injectable()
export class OdbBankAccountMapper implements Mapper<BankAccount> {
  toDomain(raw: LegacyBankAccount): BankAccount {
    const props: BankAccountProperties = {
      uid: raw.uid,
      bankAccountId: raw.bid,
      bic: raw.bic,
      beneficiaries:
        raw.beneficiaries.length <= 0
          ? []
          : raw.beneficiaries.map(item => new OdbBeneficiaryMapper().toDomain(item)),
      iban: raw.iban,
      monthlyAllowance: raw.monthlyAllowance,
      cards: raw.cards.map(item =>
        new LegacyCardMapper().toDomain({
          ...item,
          uid: raw.uid,
        }),
      ),
      ...(raw.kycDiligenceStatus && { kycDiligenceStatus: raw.kycDiligenceStatus }),
      ...(raw.kycDiligenceValidationMethod && {
        kycDiligenceValidationMethod: raw.kycDiligenceValidationMethod,
      }),
      debts: raw.debts ? raw.debts.map(debt => new Debt(debt.props)) : [],
      ...(raw.limits && { limits: { props: raw.limits } }),
      uncappingState: raw.uncappingState,
      ...(raw.productsEligibility && { productsEligibility: raw.productsEligibility }),
    };

    // handling storage in cents but domain in euros -> / 100
    if (raw.limits) {
      const limitsProps: LimitInformationProperties = {
        balanceLimit: raw.limits.balanceLimit / 100,
      };

      if (typeof raw.limits.technicalLimit !== 'undefined') {
        limitsProps.technicalLimit = raw.limits.technicalLimit / 100;
      }

      if (raw.limits.globalIn) {
        limitsProps.globalIn = {
          weeklyAllowance: raw.limits.globalIn.weeklyAllowance / 100,
          monthlyAllowance: raw.limits.globalIn.monthlyAllowance / 100,
          annualAllowance: raw.limits.globalIn.annualAllowance / 100,
        };
      }

      if (raw.limits.globalOut) {
        limitsProps.globalOut = {
          weeklyAllowance: raw.limits.globalOut.weeklyAllowance / 100,
          monthlyAllowance: raw.limits.globalOut.monthlyAllowance / 100,
          annualAllowance: raw.limits.globalOut.annualAllowance / 100,
        };
      }

      props.limits = { props: limitsProps };
    }

    return new BankAccount(props);
  }

  fromDomain(t: BankAccount): LegacyBankAccount {
    const legacyProps: LegacyBankAccount = {
      bid: t.props.bankAccountId,
      uid: t.props.uid,
      iban: t.props.iban,
      cards: t.props.cards.map(item => new LegacyCardMapper().fromDomain(item)),
      beneficiaries: t.props.beneficiaries.map(item => new OdbBeneficiaryMapper().fromDomain(item)),
      bic: t.props.bic,
      monthlyAllowance: t.props.monthlyAllowance,
      ...(t.props.kycDiligenceStatus && { kycDiligenceStatus: t.props.kycDiligenceStatus }),
      ...(t.props.kycDiligenceValidationMethod && {
        kycDiligenceValidationMethod: t.props.kycDiligenceValidationMethod,
      }),
      debts: t.props.debts,
      uncappingState: t.props.uncappingState,
      productsEligibility: t.props.productsEligibility,
    };

    // handling domain in euros but storage in cents -> x100
    if (t.props.limits) {
      const legacyLimits: LimitInformationProperties = {
        balanceLimit: t.props.limits.props.balanceLimit * 100,
      };

      if (typeof t.props.limits.props.technicalLimit !== 'undefined') {
        legacyLimits.technicalLimit = t.props.limits.props.technicalLimit * 100;
      }

      if (t.props.limits.props.globalIn) {
        legacyLimits.globalIn = {
          weeklyAllowance: t.props.limits.props.globalIn.weeklyAllowance * 100,
          monthlyAllowance: t.props.limits.props.globalIn.monthlyAllowance * 100,
          annualAllowance: t.props.limits.props.globalIn.annualAllowance * 100,
        };
      }

      if (t.props.limits.props.globalOut) {
        legacyLimits.globalOut = {
          weeklyAllowance: t.props.limits.props.globalOut.weeklyAllowance * 100,
          monthlyAllowance: t.props.limits.props.globalOut.monthlyAllowance * 100,
          annualAllowance: t.props.limits.props.globalOut.annualAllowance * 100,
        };
      }

      legacyProps.limits = legacyLimits;
    }

    return new LegacyBankAccount(legacyProps);
  }
}
