import { injectable } from 'inversify';
import { Account, LoanDetails } from '../../domain/models/Account';
import { AlgoanAccountDto, LoanDetailsDto } from '../models/AlgoanAccountDto';

@injectable()
export class AccountMapper {
  toDomain(algoanAccountDto: AlgoanAccountDto): Account {
    let account: Account;
    account = {
      id: algoanAccountDto.id,
      reference: algoanAccountDto.reference,
      bank: algoanAccountDto.bank,
      balance: algoanAccountDto.balance,
      balanceDate: new Date(algoanAccountDto.balanceDate),
      status: algoanAccountDto.status,
      type: algoanAccountDto.type,
      connectionSource: algoanAccountDto.connectionSource,
      currency: algoanAccountDto.currency,
      iban: algoanAccountDto.iban,
      bic: algoanAccountDto.bic,
      name: algoanAccountDto.name,
      usage: algoanAccountDto.usage,
      savingsDetails: algoanAccountDto.savingsDetails,
    } as Account;

    if (algoanAccountDto.loanDetails) {
      account = {
        ...account,
        loanDetails: this.loanDetailsToDomain(algoanAccountDto.loanDetails),
      };
    }

    return account;
  }

  private loanDetailsToDomain(loanDetailsDto: LoanDetailsDto): LoanDetails {
    return {
      type: loanDetailsDto.type,
      amount: loanDetailsDto.amount,
      startDate: new Date(loanDetailsDto.startDate),
      endDate: new Date(loanDetailsDto.endDate),
      payment: loanDetailsDto.payment,
      remainingCapital: loanDetailsDto.remainingCapital,
      interestRate: loanDetailsDto.interestRate,
      debitedAccountId: loanDetailsDto.debitedAccountId,
    } as LoanDetails;
  }
}
