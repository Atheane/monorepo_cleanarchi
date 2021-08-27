import { inject, injectable } from 'inversify';
import { Mapper, Currency } from '@oney/common-core';
import {
  AccountProperties as AlgoanAccountProperties,
  Account as AlgoanAccount,
  AccountUsage,
} from '@oney/algoan';
import {
  AggregationIdentifier,
  BankAccountProperties,
  BankAccount,
  BankAccountUsage,
  BankConnection,
  Bank,
} from '@oney/aggregation-core';
import { AlgoanBankAccountTypeMapper } from './AlgoanBankAccountTypeMapper';

@injectable()
export class AlgoanBankAccountMapper implements Mapper<{ bankAccount: BankAccount; bank?: Bank }> {
  constructor(
    @inject(AggregationIdentifier.algoanBankAccountTypeMapper)
    private readonly algoanBankAccountTypeMapper: AlgoanBankAccountTypeMapper,
  ) {}

  toDomain({
    raw,
    bankConnection,
  }: {
    raw: AlgoanAccount;
    bankConnection: BankConnection;
  }): { bankAccount: BankAccount; bank?: Bank } {
    const bankAccountProps: BankAccountProperties = {
      id: raw.reference,
      creditDecisioningAccountId: raw.id,
      balance: raw.balance,
      name: raw.name,
      currency: Currency[raw.currency],
      aggregated: true,
      establishment: {
        name: null,
      },
      number: raw.bic,
      metadatas: {
        iban: raw.iban,
      },
      type: this.algoanBankAccountTypeMapper.toDomain(raw.type),
      bankId: null,
      usage: BankAccountUsage.PRIV,
      ownership: null,
      connectionId: bankConnection.props.connectionId,
      userId: bankConnection.props.userId,
    };

    return { bankAccount: new BankAccount(bankAccountProps) };
  }

  async fromDomain({
    bankAccount,
    bank,
  }: {
    bankAccount: BankAccount;
    bank?: Bank;
  }): Promise<AlgoanAccountProperties> {
    const CONNECTION_SOURCE = 'BUDGET_INSIGHT';
    const { props: bankAccountProps } = bankAccount;
    /* istanbul ignore next: waiting for istanbul to support typescript optional chaining operator */
    const iban = bankAccountProps.metadatas?.iban;
    const algoanBankAccount: AlgoanAccountProperties = {
      reference: bankAccountProps.id,
      bank: bank.name,
      balance: bankAccountProps.balance,
      balanceDate: new Date(),
      type: this.algoanBankAccountTypeMapper.fromDomain(bankAccountProps.type),
      connectionSource: CONNECTION_SOURCE,
      currency: bankAccountProps.currency,
      iban,
      name: bankAccountProps.name,
      usage: AccountUsage.PERSONAL,
    };

    return algoanBankAccount;
  }
}
