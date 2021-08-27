import { injectable } from 'inversify';
import { EventStoreMongoConnection, RawSMOEventProperties } from './schemas/RawSMOEventSchema';
import { EventStoreRepository } from '../../../domain/repository/EventStoreRepository';

@injectable()
export class EventStoreMongoRepository implements EventStoreRepository {
  async save(rawSMOEventProperties: RawSMOEventProperties): Promise<RawSMOEventProperties> {
    const debtEventStore = new EventStoreMongoConnection().init().getStore();
    await debtEventStore.create(rawSMOEventProperties);
    return rawSMOEventProperties;
  }
}
