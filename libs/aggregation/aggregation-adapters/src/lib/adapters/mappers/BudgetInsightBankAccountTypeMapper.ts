import { BankAccountType } from '@oney/aggregation-core';
import { Mapper } from '@oney/common-core';
import { injectable } from 'inversify';
import { BudgetInsightBankAccountType } from '../partners/budgetinsights/models/BudgetInsightAccount';

@injectable()
export class BudgetInsightBankAccountTypeMapper implements Mapper<BankAccountType> {
  toDomain(raw: string): BankAccountType {
    let type: BankAccountType;
    switch (raw) {
      case BudgetInsightBankAccountType.CARD:
        type = BankAccountType.CARD;
        break;
      case BudgetInsightBankAccountType.CHECKING:
        type = BankAccountType.CHECKING;
        break;
      case BudgetInsightBankAccountType.JOINT:
        type = BankAccountType.JOINT;
        break;
      default:
        break;
    }
    return type;
  }
}
