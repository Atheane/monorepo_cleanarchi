import { Usecase } from '@oney/ddd';
import { EventDispatcher } from '@oney/messages-core';
import { ZipEventMessageBodySerializer } from '@oney/messages-adapters';
import { inject, injectable } from 'inversify';
import { AccountSynchronized } from '@oney/aggregation-messages';
import { Identifier } from '../../config/di';
import { EventRepository } from '../domain/repositories';
import { Bank, EventType, Event } from '../domain/types';
import { BudgetInsightAccount } from '../adapters/budgetInsight/models/BudgetInsightAccount';

export interface SaveEventsCommand {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any;
  userId: string;
  bank: Bank;
  refId: string;
}

@injectable()
export class SaveEvents implements Usecase<SaveEventsCommand, void> {
  constructor(
    @inject(Identifier.eventRepository)
    private readonly eventRepository: EventRepository,
    @inject(EventDispatcher) private readonly eventDispatcher: EventDispatcher,
  ) {}

  async execute(request: SaveEventsCommand): Promise<void> {
    const { body, userId, bank, refId } = request;
    let lastBatch: Event[];
    try {
      const events = body.transactions.map(transaction => {
        return {
          date: new Date().toUTCString(),
          type: EventType.ACCOUNT_SYNC,
          data: {
            id: body.id,
            userId,
            bank,
            ...body.account,
            transactions: [transaction],
            ...(refId && { refId }),
          },
          version: 1,
        };
      });
      // split saving in two batch, firstBatch gives rapid feedback to user
      // lastBatch gives complete feedback to user

      const firstBatch = events.slice(0, 50);
      lastBatch = events.slice(50);

      await this.eventRepository.save(firstBatch);

      const payloadAccount = {
        userId,
        bank,
        ...(refId && { refId }),
        account: {
          ...body,
        },
      };

      const accountSynchronized = new AccountSynchronized<BudgetInsightAccount, Bank>(payloadAccount);

      const customSerializer = new ZipEventMessageBodySerializer();

      console.log('Tracing BI_ACCOUNT_SYNCED payload content');
      console.log(payloadAccount);
      await this.eventDispatcher.dispatch(accountSynchronized).configure({
        customSerializer,
      });
    } catch (e) {
      /* istanbul ignore next we want to log error if CosmosDB fails to save, not testable locally */
      console.log(`Could not save transactions of account ${body.id}`, e);
    } finally {
      if (lastBatch.length > 0) {
        await this.eventRepository.save(lastBatch);
      }
    }
  }
}
