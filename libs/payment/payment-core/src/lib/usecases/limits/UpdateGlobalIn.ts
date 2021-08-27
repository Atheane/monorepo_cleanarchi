import { Usecase } from '@oney/ddd';
import {
  BankAccount,
  BankAccountGateway,
  BankAccountRepositoryRead,
  BankAccountRepositoryWrite,
  GlobalLimits,
} from '@oney/payment-core';
import { EventProducerDispatcher } from '@oney/messages-core';
import { ProfileStatus } from '@oney/profile-messages';

export interface UpdateGlobalInCommand {
  uid: string;
  profileStatus: ProfileStatus;
}

export class UpdateGlobalIn implements Usecase<UpdateGlobalInCommand, BankAccount | null> {
  constructor(
    private readonly _bankAccountGateway: BankAccountGateway,
    private readonly _bankAccountRepositoryRead: BankAccountRepositoryRead,
    private readonly _bankAccountRepositoryWrite: BankAccountRepositoryWrite,
    private readonly _eventDispatcher: EventProducerDispatcher,
    private readonly _raisedGlobalIn: GlobalLimits,
  ) {}

  async execute(command: UpdateGlobalInCommand): Promise<BankAccount | null> {
    if (command.profileStatus === ProfileStatus.ACTIVE) {
      const bankAccount: BankAccount = await this._bankAccountRepositoryRead.findById(command.uid);

      bankAccount.updateLimits({ globalIn: this._raisedGlobalIn });
      await this._bankAccountGateway.updateLimitInformation(command.uid, bankAccount.props.limits);
      await this._bankAccountRepositoryWrite.save(bankAccount);
      await this._eventDispatcher.dispatch(bankAccount);

      return bankAccount;
    }

    return null;
  }
}
