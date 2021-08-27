import { injectable } from 'inversify';
import { EventProducer } from './EventProducer';

@injectable()
export abstract class EventProducerDispatcher {
  abstract dispatch(producer: EventProducer): Promise<void>;
}
