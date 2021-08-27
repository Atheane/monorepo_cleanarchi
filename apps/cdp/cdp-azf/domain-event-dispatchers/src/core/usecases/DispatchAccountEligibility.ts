import { inject, injectable } from 'inversify';
import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { Client } from '@oney/cdp-core';
import { ValidAccountEligibilityPayload } from '../domain/valueobjects';
import { IAccountEligibilityCalculatedPayload } from '../domain/types';

@injectable()
export class DispatchAccountEligibility implements Usecase<IAccountEligibilityCalculatedPayload, Client> {
  constructor(@inject(EventProducerDispatcher) private readonly eventDispatcher: EventProducerDispatcher) {}

  async execute(cmd: IAccountEligibilityCalculatedPayload): Promise<Client> {
    const cdpCommand = new ValidAccountEligibilityPayload(cmd);
    await cdpCommand.validate();

    const client = new Client({ userId: cmd.uId });
    client.setAccountEligibility({
      uId: cmd.uId,
      eligibility: cmd.eligibility,
      timestamp: new Date(cmd.timestamp),
      balanceLimit: cmd.balanceLimit,
    });

    await this.eventDispatcher.dispatch(client);

    return client;
  }
}
