import { ProfileErrors } from '@oney/profile-core';
import { PublicProperties } from '@oney/common-core';
import { BankAccountOwnerCommand } from '../../usecases/resources/VerifyBankAccountOwner';

export class BankAccountIdentity {
  identity?: string;
  lastName?: string;
  firstName?: string;
  birthDate?: Date;
  bankName: string;

  constructor(bankAccountOwner: PublicProperties<BankAccountOwnerCommand>) {
    if (bankAccountOwner.lastName && bankAccountOwner.firstName) {
      this.lastName = bankAccountOwner.lastName;
      this.firstName = bankAccountOwner.firstName;
    } else if (bankAccountOwner.identity) {
      this.identity = bankAccountOwner.identity;
    } else {
      throw new ProfileErrors.BankAccountIdentityError('Missing identity information');
    }
    if (bankAccountOwner.birthDate) this.birthDate = new Date(bankAccountOwner.birthDate);
    this.bankName = bankAccountOwner.bankName;
  }
}
