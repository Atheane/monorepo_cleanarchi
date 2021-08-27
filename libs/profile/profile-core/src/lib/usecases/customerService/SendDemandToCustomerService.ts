import { inject, injectable } from 'inversify';
import { Usecase } from '@oney/ddd';
import { EventDispatcher } from '@oney/messages-core';
import { CustomerServiceDemandSent } from '@oney/profile-messages';

export interface SendDemandToCustomerServiceCommand {
  firstname: string;
  lastname: string;
  birthname?: string;
  email: string;
  phone: string;
  gender: string;
  userId?: string; // if user is connected
  topic: string;
  demand: string;
}

@injectable()
export class SendDemandToCustomerService implements Usecase<SendDemandToCustomerServiceCommand, boolean> {
  constructor(@inject(EventDispatcher) private readonly eventDispatcher: EventDispatcher) {}

  async execute(cmd: SendDemandToCustomerServiceCommand): Promise<boolean> {
    const demandToCustomerServiceSent = new CustomerServiceDemandSent(cmd);
    await this.eventDispatcher.dispatch(demandToCustomerServiceSent);
    // to-do domain error if file is too large
    return true;
  }
}
