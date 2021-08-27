import { Mapper } from '@oney/common-core';
import { injectable } from 'inversify';
import { AccountStatementProperties } from '@oney/pfm-core';
import { AccountStatementDoc } from '../mongodb/models/AccountStatement';

@injectable()
export class AccountStatementMapper implements Mapper<AccountStatementProperties> {
  toDomain(raw: AccountStatementDoc): AccountStatementProperties {
    return { ...raw };
  }
}
