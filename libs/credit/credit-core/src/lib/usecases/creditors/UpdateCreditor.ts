import { Usecase } from '@oney/ddd';
import { defaultLogger } from '@oney/logger-adapters';
import { inject, injectable } from 'inversify';
import { CreditIdentifiers } from '../../CreditIdentifiers';
import { CreditorError } from '../../domain/models/DomainError';
import { Creditor } from '../../domain/entities/Creditor';
import { CreditorRepository } from '../../domain/repositories/CreditorRepository';

export interface UpdateCreditorCommand {
  userId: string;
  isEligible: boolean;
}

@injectable()
export class UpdateCreditor implements Usecase<UpdateCreditorCommand, Creditor> {
  constructor(
    @inject(CreditIdentifiers.creditorRepository) private readonly creditorRepository: CreditorRepository,
  ) {}

  async execute(request: UpdateCreditorCommand): Promise<Creditor> {
    const { userId, isEligible } = request;
    try {
      const creditor = await this.creditorRepository.findBy(userId);
      creditor.update({ isEligible });
      return this.creditorRepository.save(creditor.props);
    } catch (error) {
      if (error.code === new CreditorError.UserNotFound().code) {
        const creditor = Creditor.create({
          userId,
          isEligible,
        });
        return this.creditorRepository.create(creditor.props);
      }
      defaultLogger.info('UpdateCreditor.execute', error);
      throw error;
    }
  }
}
