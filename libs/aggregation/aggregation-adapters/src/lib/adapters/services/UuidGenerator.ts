import { IdGenerator } from '@oney/aggregation-core';
import { injectable } from 'inversify';
import { v4 as uuidv4 } from 'uuid';

@injectable()
export class UuidGenerator implements IdGenerator {
  generateUniqueID(): string {
    return uuidv4();
  }
}
