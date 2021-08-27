import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { AggregationIdentifier } from '../../AggregationIdentifier';
import { Bank } from '../../domain/entities/Bank';
import { BankRepository } from '../../domain/repositories/BankRepository';

export interface GetBankByIdCommand {
  id: string;
}

@injectable()
export class GetBankById implements Usecase<GetBankByIdCommand, Bank> {
  constructor(
    @inject(AggregationIdentifier.bankRepository) private readonly banksRepository: BankRepository,
  ) {}

  execute(request: GetBankByIdCommand): Promise<Bank> {
    return this.banksRepository.getById(request.id);
  }
}
