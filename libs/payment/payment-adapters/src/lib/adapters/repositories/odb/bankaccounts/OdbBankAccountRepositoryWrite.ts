import { PaymentIdentifier, BankAccount, BankAccountRepositoryWrite, WriteService } from '@oney/payment-core';
import { inject, injectable } from 'inversify';
import { OdbBankAccountMapper } from '../../../mappers/OdbBankAccountMapper';
import { AccountDbModel } from '../../../mongodb/models/BankAccountModel';

@injectable()
export class OdbBankAccountRepositoryWrite implements BankAccountRepositoryWrite {
  constructor(
    @inject(PaymentIdentifier.accountManagementWriteService) private readonly _writeService: WriteService,
    private readonly _odbBankAccountMapper: OdbBankAccountMapper,
  ) {}

  async save(bankAccount: BankAccount): Promise<BankAccount> {
    await this._writeService.upsert<AccountDbModel>(
      { uid: bankAccount.props.uid },
      this._odbBankAccountMapper.fromDomain(bankAccount),
    );
    return bankAccount;
  }
}
