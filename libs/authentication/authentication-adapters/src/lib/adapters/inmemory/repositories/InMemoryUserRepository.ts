import { User, UserRepository } from '@oney/authentication-core';
import { Maybe, makeJust, MaybeType, makeNothing } from '@oney/common-core';
import { injectable } from 'inversify';
import { UserMapper } from '../../mappers/user/UserMapper';
import { UserDto } from '../../mongodb/models/user.schema';

@injectable()
export class InMemoryUserRepository implements UserRepository {
  private store: Map<string, UserDto>;
  private _mapper = new UserMapper();

  /**
   * Note:
   * Previously a closure was used on the users map passed to construct the repo
   * This allowed to directly modify the users map to affect the repo store in the tests
   * This is no longer the case:
   * the repo store is now a UserDto map (closer to real world behavior since user aggregate root refactoring)
   * In the tests, you need to call the repo CRUD methods to modify the store.
   * Modifying the users map after construction will do nothing on the repo store.
   * @param users
   */
  constructor(users: Map<string, User>) {
    const userDtos: [string, UserDto][] = [...users].map(([key, user]) => [
      key,
      this._mapper.fromDomain(user),
    ]);
    this.store = new Map(userDtos);
  }

  async getById(id: string): Promise<Maybe<User>> {
    const userDto = this.store.get(id);
    if (!userDto) return makeNothing();
    return makeJust<User>(this._mapper.toDomain(userDto));
  }

  async save(user: User): Promise<User> {
    const maybeFoundUser = await this.getById(user.props.uid);
    if (maybeFoundUser.type === MaybeType.Just) this._updateFoundUser(user, maybeFoundUser.value);
    this._saveUpdatedUser(user);
    const updatedUserDto = this.store.get(user.props.uid);
    return this._mapper.toDomain(updatedUserDto);
  }

  private _saveUpdatedUser(user: User) {
    const updateDto = this._mapper.fromDomain(user);
    this.store.set(user.props.uid, updateDto);
  }

  private _updateFoundUser(user: User, foundUser: User) {
    user.props = { ...foundUser.props, ...user.props };
  }

  async findByEmail(address: string): Promise<Maybe<User>> {
    const userDtos = [...this.store.values()];
    const foundUserDto = userDtos.find(({ email }) => email === address);
    if (!foundUserDto) return makeNothing();
    return makeJust<User>(this._mapper.toDomain(foundUserDto));
  }
}
