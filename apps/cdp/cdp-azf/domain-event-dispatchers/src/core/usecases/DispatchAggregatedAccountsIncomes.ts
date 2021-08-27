import { inject, injectable } from 'inversify';
import { Usecase } from '@oney/ddd';
import { Client } from '@oney/cdp-core';
import { EventProducerDispatcher } from '@oney/messages-core';
import { ValidAggregatedAccountsIncomesPayload } from '../domain/valueobjects';
import { IAggregatedAccountsIncomesCheckedPayload } from '../domain/types';

@injectable()
export class DispatchAggregatedAccountsIncomes
  implements Usecase<IAggregatedAccountsIncomesCheckedPayload, Client> {
  constructor(@inject(EventProducerDispatcher) private readonly eventDispatcher: EventProducerDispatcher) {}

  async execute(cmd: IAggregatedAccountsIncomesCheckedPayload): Promise<Client> {
    const cdpCommand = new ValidAggregatedAccountsIncomesPayload(cmd);
    await cdpCommand.validate();

    const client = new Client({ userId: cmd.uId });
    client.setAggregatedAccountsIncomes({
      uid: cmd.uId,
      verifications: cmd.possibleRevenuesDetected,
    });

    await this.eventDispatcher.dispatch(client);

    return client;
  }
}
