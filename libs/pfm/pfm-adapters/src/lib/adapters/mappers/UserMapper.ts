import { Mapper } from '@oney/common-core';
import { injectable } from 'inversify';
import { User } from '@oney/pfm-core';
import { UserDoc } from '../mongodb/models/User';

@injectable()
export class UserMapper implements Mapper<User> {
  toDomain(raw: UserDoc): User {
    return {
      uid: raw.uid,
      is_validated: raw.is_validated,
    };
  }
}
