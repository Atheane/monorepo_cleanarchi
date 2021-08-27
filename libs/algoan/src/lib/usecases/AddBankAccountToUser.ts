import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { AddBankAccountCommand } from './types/AddBankAccountCommand';
import { Identifiers } from '../bootstrap/Identifiers';
import { Account } from '../domain/models/Account';
import { AlgoanRepository } from '../domain/port/AlgoanRepository';

@injectable()
export class AddBankAccountToUser implements Usecase<AddBankAccountCommand, Account> {
  constructor(
    @inject(Identifiers.AlgoanRepository)
    private readonly _algoanRepository: AlgoanRepository,
  ) {}

  async execute(addBankAccountCommand: AddBankAccountCommand): Promise<Account> {
    const { accountProperties, bankUserId } = addBankAccountCommand;
    return await this._algoanRepository.addBankAccount(accountProperties, bankUserId);
  }
}
