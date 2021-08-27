import { AggregateRoot, Handle } from '@oney/ddd';
import { Currency } from '@oney/common-core';
import { BankAccountAggregated, BankAccountAggregatedProps } from '@oney/aggregation-messages';
import { Transaction } from '../entities/Transaction';
import { OwnerIdentity } from '../types/OwnerIdentity';
import { BankAccountType } from '../types/BankAccountType';
import { Establishment } from '../types/Establishment';
import { Iban } from '../types/Iban';
import { BankAccountUsage } from '../types/BankAccountUsage';

export interface BankAccountProperties {
  id: string;
  connectionId: string;
  userId: string;
  bankId: string;
  creditDecisioningAccountId?: string; // creditDecisioning partner (algoan) id
  name: string;
  number: string;
  currency?: Currency;
  balance: number;
  establishment: Establishment;
  metadatas: Iban;
  aggregated: boolean;
  type: BankAccountType;
  ownerIdentity?: OwnerIdentity; // optionnal because not available for all banks to-do: should be in connection Model
  transactions?: Transaction[]; // optionnal, cause available only if account has been aggregated
  isOwnerBankAccount?: boolean; // optionnal because not implemented when account are listed, only when account are aggregated
  usage?: BankAccountUsage;
  ownership?: string;
}

export class BankAccount extends AggregateRoot<BankAccountProperties> {
  public props: BankAccountProperties;

  constructor(props: BankAccountProperties) {
    super(props.id);
    this.props = props;
  }

  setTransactions(transactions: Transaction[]): void {
    this.props.transactions = transactions;
  }

  setOwnerIdentity(ownerIdentity: OwnerIdentity): void {
    this.props.ownerIdentity = ownerIdentity;
  }

  aggregateBankAccount(eventProps: BankAccountAggregatedProps): void {
    this.applyChange(new BankAccountAggregated(eventProps));
  }
  @Handle(BankAccountAggregated)
  applyAggregateBankAccount({ props }: BankAccountAggregated): void {
    this.props.aggregated = true;
    this.props.isOwnerBankAccount = props.isOwnerBankAccount;
  }

  delete(): void {
    this.props = undefined;
  }
}
