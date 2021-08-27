import { inject, injectable } from 'inversify';
import { Usecase } from '@oney/ddd';
import { CreditIdentifiers } from '../../CreditIdentifiers';
import { Creditor } from '../../domain/entities';
import { CreditorRepository } from '../../domain/repositories';

export interface CreateCreditorCommand {
  userId: string;
  isEligible: boolean;
}

@injectable()
export class CreateCreditor implements Usecase<CreateCreditorCommand, Creditor> {
  constructor(
    @inject(CreditIdentifiers.creditorRepository) private readonly creditorRepository: CreditorRepository,
  ) {}

  async execute(request: CreateCreditorCommand): Promise<Creditor> {
    const { userId, isEligible } = request;
    const creditor = Creditor.create({
      userId,
      isEligible,
    });
    return this.creditorRepository.create(creditor.props);
  }
}
