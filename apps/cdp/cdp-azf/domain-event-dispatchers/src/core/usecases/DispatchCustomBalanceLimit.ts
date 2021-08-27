import { inject, injectable } from 'inversify';
import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { Client } from '@oney/cdp-core';
import { ValidCustomBalanceLimitPayload } from '../domain/valueobjects';
import { ICustomBalanceLimitCalculatedPayload } from '../domain/types';

@injectable()
export class DispatchCustomBalanceLimit implements Usecase<ICustomBalanceLimitCalculatedPayload, Client> {
  constructor(@inject(EventProducerDispatcher) private readonly eventDispatcher: EventProducerDispatcher) {}

  async execute(cmd: ICustomBalanceLimitCalculatedPayload): Promise<Client> {
    const cdpCommand = new ValidCustomBalanceLimitPayload(cmd);
    await cdpCommand.validate();

    const client = new Client({ userId: cmd.uId });
    client.setCustomerBalanceLimit({
      uId: cmd.uId,
      customBalanceLimitEligibility: cmd.eligibility,
      customBalanceLimit: cmd.customBalanceLimit,
      verifiedRevenues: cmd.verifiedRevenues,
    });

    await this.eventDispatcher.dispatch(client);

    return client;
  }
}
