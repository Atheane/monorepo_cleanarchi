import { inject, injectable } from 'inversify';
import { Usecase } from '@oney/ddd';
import { Identifier } from '../../config/di';
import { EventRepository } from '../domain/repositories';

export interface DeleteTransactionsCommand {
  accountIds: string[];
}

@injectable()
export class DeleteTransactionsByConnectionId implements Usecase<DeleteTransactionsCommand, void> {
  constructor(@inject(Identifier.eventRepository) private readonly eventRepository: EventRepository) {}

  async execute(request: DeleteTransactionsCommand): Promise<void> {
    const { accountIds } = request;
    await this.eventRepository.deleteMany(accountIds);
  }
}
