import { BankConnectionProperties, BankAccountProperties } from '@oney/aggregation-core';
import { IBank } from '../../bank/dto';

export interface IBankConnectionWithBankAndAccount
  extends Pick<
    BankConnectionProperties,
    'connectionId' | 'userId' | 'bankId' | 'refId' | 'active' | 'state'
  > {
  bank: IBank;
  accounts?: Pick<
    BankAccountProperties,
    'id' | 'name' | 'number' | 'currency' | 'balance' | 'establishment' | 'metadatas' | 'aggregated'
  >[];
}

export type IBankConnection = Pick<
  BankConnectionProperties,
  'connectionId' | 'userId' | 'bankId' | 'refId' | 'active' | 'state' | 'form'
>;
