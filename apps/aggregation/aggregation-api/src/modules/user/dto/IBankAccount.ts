import { BankAccountProperties, Establishment } from '@oney/aggregation-core';
import { IBank } from '../../bank/dto';

export type IBankAccountProperties = Pick<
  BankAccountProperties,
  | 'id'
  | 'name'
  | 'number'
  | 'currency'
  | 'balance'
  | 'establishment'
  | 'metadatas'
  | 'aggregated'
  | 'type'
  | 'usage'
>;

export interface IBankAccountPropertiesWithBank {
  id: string;
  name: string;
  number: string;
  currency: string;
  balance: number;
  establishment: Establishment;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadatas: any;
  aggregated: boolean;
  bank: IBank;
}
