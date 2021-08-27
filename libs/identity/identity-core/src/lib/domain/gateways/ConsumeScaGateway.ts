import { Identity } from '../entities/Identity';

export interface ConsumeScaGateway {
  consume(identity: Identity): Promise<void>;
}
