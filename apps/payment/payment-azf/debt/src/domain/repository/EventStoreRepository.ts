import { RawSMOEventProperties } from '../../adapters/repository/mongodb/schemas/RawSMOEventSchema';

export interface EventStoreRepository {
  save(rawSMOEventProperties: RawSMOEventProperties): Promise<RawSMOEventProperties>;
}
