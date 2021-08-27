import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { GetBankUserCreditAnalysisCommand } from './types/GetUserBankCreditScoreCommand';
import { Identifiers } from '../bootstrap/Identifiers';
import { Aden } from '../domain/models/Aden/Aden';
import { AlgoanRepository } from '../domain/port/AlgoanRepository';

@injectable()
export class GetBankUserCreditAnalysis implements Usecase<GetBankUserCreditAnalysisCommand, Aden[]> {
  constructor(
    @inject(Identifiers.AlgoanRepository)
    private readonly _algoanRepository: AlgoanRepository,
  ) {}

  async execute({ bankUserId }: GetBankUserCreditAnalysisCommand): Promise<Aden[]> {
    return this._algoanRepository.getBankUserCreditAnalysis(bankUserId);
  }
}
