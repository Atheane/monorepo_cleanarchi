import { AccountProperties } from '../../domain/models/Account';

export type AddBankAccountCommand = {
  bankUserId: string;
  accountProperties: AccountProperties;
};
