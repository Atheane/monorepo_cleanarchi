import { injectable } from 'inversify';
import { v4 as uuidv4 } from 'uuid';
import { IdGenerator } from '@oney/credit-core';

@injectable()
export class LongUuidGenerator implements IdGenerator {
  generateUniqueID(): string {
    return uuidv4();
  }
}
