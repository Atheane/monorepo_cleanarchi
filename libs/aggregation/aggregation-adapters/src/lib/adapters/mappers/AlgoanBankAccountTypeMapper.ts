import { BankAccountType } from '@oney/aggregation-core';
import { AccountType as AlgoanAccountType } from '@oney/algoan';
import { Mapper } from '@oney/common-core';
import { injectable } from 'inversify';

@injectable()
export class AlgoanBankAccountTypeMapper implements Mapper<BankAccountType> {
  toDomain(raw: string): BankAccountType {
    let type: BankAccountType;
    switch (raw) {
      case AlgoanAccountType.CHECKINGS:
        type = BankAccountType.CHECKING;
        break;
      case AlgoanAccountType.CREDIT_CARD:
        type = BankAccountType.CARD;
        break;
      default:
        break;
    }
    return type;
  }

  fromDomain(type: BankAccountType): AlgoanAccountType {
    let algoanType: AlgoanAccountType;
    switch (type) {
      case BankAccountType.CHECKING:
        algoanType = AlgoanAccountType.CHECKINGS;
        break;
      case BankAccountType.JOINT:
        algoanType = AlgoanAccountType.CHECKINGS;
        break;
      case BankAccountType.CARD:
        algoanType = AlgoanAccountType.CREDIT_CARD;
        break;
      default:
        break;
    }
    return algoanType;
  }
}
