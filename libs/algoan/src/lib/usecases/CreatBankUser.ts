import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { Identifiers } from '../bootstrap/Identifiers';
import { AdenTriggers, BankUser, BankUserProperties } from '../domain/models/BankUser';
import { AlgoanRepository } from '../domain/port/AlgoanRepository';

@injectable()
export class CreatBankUser implements Usecase<void, BankUser> {
  constructor(
    @inject(Identifiers.AlgoanRepository)
    private readonly _algoanRepository: AlgoanRepository,
  ) {}

  async execute(): Promise<BankUser> {
    const bankUserProperties = {
      adenTriggers: {
        onSynchronizationFinished: true,
      } as AdenTriggers,
    } as BankUserProperties;
    return await this._algoanRepository.creatBankUser(bankUserProperties);
  }
}
