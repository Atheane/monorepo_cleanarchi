import { inject, injectable } from 'inversify';
import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { Client } from '@oney/cdp-core';
import { ValidX3X4EligibilityPayload } from '../domain/valueobjects';
import { IX3X4EligibilityCalculatedPayload } from '../domain/types/IX3X4EligibilityCalculatedPayload';

@injectable()
export class DispatchX3X4Eligibility implements Usecase<IX3X4EligibilityCalculatedPayload, Client> {
  constructor(@inject(EventProducerDispatcher) private readonly eventDispatcher: EventProducerDispatcher) {}

  async execute(cmd: IX3X4EligibilityCalculatedPayload): Promise<Client> {
    const cdpCommand = new ValidX3X4EligibilityPayload(cmd);
    await cdpCommand.validate();

    const client = new Client({ userId: cmd.uId });
    client.setX3X4Eligibility({
      uId: cmd.uId,
      eligibility: cmd.eligibility,
    });

    await this.eventDispatcher.dispatch(client);

    return client;
  }
}
