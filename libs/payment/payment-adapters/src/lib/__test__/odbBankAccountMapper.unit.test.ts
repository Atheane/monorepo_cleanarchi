import { v4 as uuidV4 } from 'uuid';
import {
  BankAccount,
  BankAccountProperties,
  DiligenceStatus,
  DiligencesType,
  UncappingState,
} from '@oney/payment-core';
import { LegacyBankAccount } from '../adapters/mongodb/models/legacy/LegacyBankAccount';
import { OdbBankAccountMapper } from '../adapters/mappers/OdbBankAccountMapper';

describe('Testsuite of OdbBankAccountMapper', () => {
  it('unit test of toDomain with limitInformation', () => {
    const legacyProps: LegacyBankAccount = {
      bid: uuidV4(),
      uid: uuidV4(),
      iban: 'azerty',
      cards: [],
      beneficiaries: [],
      bic: 'azerty',
      monthlyAllowance: {
        remainingFundToSpend: 42,
        authorizedAllowance: 42,
      },
      kycDiligenceStatus: DiligenceStatus.VALIDATED,
      kycDiligenceValidationMethod: DiligencesType.AGGREGATION,
      debts: [],
      limits: {
        globalIn: {
          annualAllowance: 4500000,
          monthlyAllowance: 300000,
          weeklyAllowance: 300000,
        },
        globalOut: {
          annualAllowance: 1200000,
          monthlyAllowance: 100000,
          weeklyAllowance: 100000,
        },
        balanceLimit: 100000,
        technicalLimit: 0,
      },
      uncappingState: UncappingState.CAPPED,
      productsEligibility: {
        account: false,
        splitPayment: true,
      },
    };
    const legacy = new LegacyBankAccount(legacyProps);
    const mapper = new OdbBankAccountMapper();
    const bankAccount = mapper.toDomain(legacy);

    expect(bankAccount.props.limits.props).toStrictEqual({
      globalIn: {
        annualAllowance: 45000,
        monthlyAllowance: 3000,
        weeklyAllowance: 3000,
      },
      globalOut: {
        annualAllowance: 12000,
        monthlyAllowance: 1000,
        weeklyAllowance: 1000,
      },
      balanceLimit: 1000,
      technicalLimit: 0,
    });
  });

  it('unit test of toDomain without limitInformation', () => {
    const legacyProps: LegacyBankAccount = {
      bid: uuidV4(),
      uid: uuidV4(),
      iban: 'azerty',
      cards: [],
      beneficiaries: [],
      bic: 'azerty',
      monthlyAllowance: {
        remainingFundToSpend: 42,
        authorizedAllowance: 42,
      },
      kycDiligenceStatus: DiligenceStatus.REFUSED,
      kycDiligenceValidationMethod: DiligencesType.UNKNOWN,
      debts: [],
      uncappingState: UncappingState.CAPPED,
      productsEligibility: {
        account: false,
        splitPayment: true,
      },
    };
    const legacy = new LegacyBankAccount(legacyProps);
    const mapper = new OdbBankAccountMapper();
    const bankAccount = mapper.toDomain(legacy);

    expect(bankAccount.props.uid).toBe(legacy.uid);
  });

  it('should return legacy bankAccount version', () => {
    const props: BankAccountProperties = {
      bankAccountId: uuidV4(),
      uid: uuidV4(),
      iban: 'azerty',
      cards: [],
      beneficiaries: [],
      bic: 'azerty',
      monthlyAllowance: {
        remainingFundToSpend: 42,
        authorizedAllowance: 42,
      },
      kycDiligenceStatus: DiligenceStatus.VALIDATED,
      kycDiligenceValidationMethod: DiligencesType.AGGREGATION,
      debts: [],
      limits: {
        props: {
          globalIn: {
            annualAllowance: 17000,
            monthlyAllowance: 1500,
            weeklyAllowance: 1500,
          },
          globalOut: {
            annualAllowance: 17000,
            monthlyAllowance: 1500,
            weeklyAllowance: 1500,
          },
          balanceLimit: 1200,
          technicalLimit: 500,
        },
      },
      uncappingState: UncappingState.CAPPED,
      productsEligibility: {
        account: false,
        splitPayment: true,
      },
    };
    const bankAccount: BankAccount = new BankAccount(props);
    const mapper = new OdbBankAccountMapper();
    const legacyBankAccount = mapper.fromDomain(bankAccount);
    expect(legacyBankAccount.limits).toStrictEqual({
      globalIn: {
        annualAllowance: 1700000,
        monthlyAllowance: 150000,
        weeklyAllowance: 150000,
      },
      globalOut: {
        annualAllowance: 1700000,
        monthlyAllowance: 150000,
        weeklyAllowance: 150000,
      },
      balanceLimit: 120000,
      technicalLimit: 50000,
    });
  });
});
