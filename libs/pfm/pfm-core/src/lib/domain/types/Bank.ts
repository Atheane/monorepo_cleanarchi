import { TransactionSource } from '@oney/common-core';

export type Bank = {
  name: string;
  logo: string;
  source: TransactionSource;
};
