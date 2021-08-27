import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { AggregationIdentifier } from '../../AggregationIdentifier';
import { Bank } from '../../domain/entities/Bank';
import { BankRepository } from '../../domain/repositories/BankRepository';

@injectable()
export class GetAllBanks implements Usecase<void, Bank[]> {
  constructor(
    @inject(AggregationIdentifier.bankRepository) private readonly banksRepository: BankRepository,
  ) {}

  execute(): Promise<Bank[]> {
    return this.banksRepository.getAll();
  }
}
