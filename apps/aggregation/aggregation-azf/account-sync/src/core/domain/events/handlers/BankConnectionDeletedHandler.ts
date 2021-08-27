/* eslint-disable @typescript-eslint/no-explicit-any */
import { BankConnectionDeleted } from '@oney/aggregation-messages';
import { DomainEventHandler } from '@oney/ddd';
import { injectable } from 'inversify';
import { DeleteTransactionsByConnectionId } from '../../../usecases';

@injectable()
export class BankConnectionDeletedHandler extends DomainEventHandler<BankConnectionDeleted> {
  private readonly usecase: DeleteTransactionsByConnectionId;

  constructor(usecase: DeleteTransactionsByConnectionId) {
    super();
    this.usecase = usecase;
  }

  async handle(domainEvent: BankConnectionDeleted): Promise<void> {
    const { deletedAccountIds } = domainEvent.props;
    await this.usecase.execute({ accountIds: deletedAccountIds });
  }
}
