import {
  AuthIdentifier,
  GetProfileInformationGateway,
  User,
  UserRepository,
} from '@oney/authentication-core';
import { makeJust, makeNothing, Maybe } from '@oney/common-core';
import { inject, injectable } from 'inversify';
import { DocumentDefinition, Model } from 'mongoose';
import { UserMapper } from '../../mappers/user/UserMapper';
import { UserDoc, UserModel } from '../models/user.schema';
// Case cover in Authentication-api
/* istanbul ignore next */
@injectable()
export class MongodbUserRepository implements UserRepository {
  private userModel: Model<UserDoc>;

  constructor(
    @inject(UserMapper) private readonly _mapper: UserMapper,
    @inject(AuthIdentifier.getProfileInformationGateway)
    private readonly _getProfileInformationGateway: GetProfileInformationGateway,
  ) {
    this.userModel = UserModel;
  }

  async save(user: User) {
    const filter = { uid: user.props.uid };
    const userDto = this._mapper.fromDomain(user);
    const update = { ...userDto, updatedAt: new Date() };
    const options = { new: true, upsert: true, setDefaultsOnInsert: true };
    const resultDoc = await this.userModel.findOneAndUpdate(filter, update, options).select('-_id').lean();
    return this._mapper.toDomain(resultDoc);
  }

  async getById(id: string): Promise<Maybe<User>> {
    const filter = { uid: id };
    let userDoc = await this.userModel.findOne(filter).select('-_id').lean();
    if (_.hasNotFound(userDoc)) return makeNothing();
    if (_.isLegacyWithPhone(userDoc)) userDoc = await this._migratePhone(userDoc);
    return makeJust<User>(this._mapper.toDomain(userDoc));
  }

  async findByEmail(address: string): Promise<Maybe<User>> {
    const filter = { email: address };
    let userDoc = await this.userModel.findOne(filter).select('-_id').lean();
    if (_.hasNotFound(userDoc)) return makeNothing();
    if (_.isLegacyWithPhone(userDoc)) userDoc = await this._migratePhone(userDoc);
    return makeJust<User>(this._mapper.toDomain(userDoc));
  }

  private async _migratePhone(userDoc: DocumentDefinition<UserDoc>): Promise<DocumentDefinition<UserDoc>> {
    userDoc.phone =
      userDoc.metadata?.phone ??
      (await this._getProfileInformationGateway.getById(userDoc.uid)).informations.phone;
    delete userDoc.metadata?.phone && _.isEmpty(userDoc.metadata) && (userDoc.metadata = null);
    return userDoc;
  }
}

namespace _ {
  export const isUndefined = (o: unknown) => typeof o === 'undefined';
  export const isNull = (o: unknown) => o === null;
  export const isEmpty = (o: unknown) => o && Object.keys(o).length === 0;
  export function hasNotFound(userDoc: DocumentDefinition<UserDoc>) {
    return isUndefined(userDoc) || isNull(userDoc) || isEmpty(userDoc);
  }
  export function isLegacyWithPhone(userDoc: DocumentDefinition<UserDoc>): boolean {
    const isBooleanToString = userDoc.phone === true.toString();
    return isBooleanToString;
  }
}
