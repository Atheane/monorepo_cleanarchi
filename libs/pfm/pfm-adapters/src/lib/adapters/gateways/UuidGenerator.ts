import { injectable } from 'inversify';
import { v4 as uuidv4 } from 'uuid';
import { IdGenerator } from '@oney/pfm-core';

@injectable()
export class UuidGenerator implements IdGenerator {
  generateUniqueID(): string {
    return uuidv4();
  }
}
