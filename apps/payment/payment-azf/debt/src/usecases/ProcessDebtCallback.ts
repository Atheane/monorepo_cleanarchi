import { Usecase } from '@oney/ddd';
import { EventDispatcher } from '@oney/messages-core';
import { RawSmoDebtReceived } from '@oney/payment-messages';
import { inject, injectable } from 'inversify';
import { RawSMOEventProperties } from '../adapters/repository/mongodb/schemas/RawSMOEventSchema';
import { Identifiers } from '../bootstrap/Identifiers';
import { EventStoreRepository } from '../domain/repository/EventStoreRepository';

@injectable()
export class ProcessDebtCallback implements Usecase<any, void> {
  constructor(
    @inject(Identifiers.EventStoreRepository) private readonly eventStoreRepository: EventStoreRepository,
    @inject(EventDispatcher) private readonly eventDispatcher: EventDispatcher,
  ) {}

  async execute(request: any): Promise<void> {
    const rawSMOEventProperties = {
      date: new Date(),
      type: 'DEBT',
      data: request,
      version: 1,
    } as RawSMOEventProperties;
    await this.eventStoreRepository.save(rawSMOEventProperties);
    const rawSmoDebtReceived = new RawSmoDebtReceived(request);
    await this.eventDispatcher.dispatch(rawSmoDebtReceived);
  }
}
