import { Email, User } from '@oney/authentication-core';
import { Mapper } from '@oney/common-core';
import { injectable } from 'inversify';
import { UserDto } from '../../mongodb/models/user.schema';

@injectable()
export class UserMapper implements Mapper<User, UserDto> {
  toDomain(raw: UserDto): User {
    delete raw?.createdAt;
    delete raw?.updatedAt;
    const { uid, email: address, phone } = raw;
    return new User({ ...raw, uid, phone: this._handleLegacy(phone), email: Email.from(address) });
  }

  fromDomain({ props }: User): UserDto {
    return { ...props, email: props.email.address };
  }

  private _handleLegacy(phone: string): string {
    return phone === false.toString() ? null : phone;
  }
}
