import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { Identifiers } from '../bootstrap/Identifiers';
import { BankUser, BankUserProperties, BankUserStatus } from '../domain/models/BankUser';
import { AlgoanRepository } from '../domain/port/AlgoanRepository';

@injectable()
export class FinalizeBankAccountCreation implements Usecase<string, BankUser> {
  constructor(
    @inject(Identifiers.AlgoanRepository)
    private readonly _algoanRepository: AlgoanRepository,
  ) {}

  async execute(bankUserId: string): Promise<BankUser> {
    const bankUserProperties = {
      status: BankUserStatus.FINISHED,
    } as BankUserProperties;
    return await this._algoanRepository.finalize(bankUserId, bankUserProperties);
  }
}
