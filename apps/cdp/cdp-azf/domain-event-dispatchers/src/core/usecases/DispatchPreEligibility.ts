import { inject, injectable } from 'inversify';
import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { Client } from '@oney/cdp-core';
import { ValidPreEligibilityPayload } from '../domain/valueobjects';
import { IPreEligibilityOKPayload } from '../domain/types';

@injectable()
export class DispatchPreEligibility implements Usecase<IPreEligibilityOKPayload, Client> {
  constructor(@inject(EventProducerDispatcher) private readonly eventDispatcher: EventProducerDispatcher) {}

  async execute(cmd: IPreEligibilityOKPayload): Promise<Client> {
    const cdpCommand = new ValidPreEligibilityPayload(cmd);
    await cdpCommand.validate();

    const client = new Client({ userId: cmd.uId });
    client.setPreEligibilityOK({
      uId: cmd.uId,
      timestamp: new Date(cmd.timestamp),
    });

    await this.eventDispatcher.dispatch(client);

    return client;
  }
}
