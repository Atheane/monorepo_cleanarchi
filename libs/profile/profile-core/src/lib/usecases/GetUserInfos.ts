import { Usecase } from '@oney/ddd';
import { Authorization, Identity, ServiceName } from '@oney/identity-core';
import { inject, injectable } from 'inversify';
import { Identifiers } from '../Identifiers';
import { Profile } from '../domain/aggregates/Profile';
import { ProfileRepositoryRead } from '../domain/repositories/read/ProfileRepositoryRead';

interface GetUserInfosRequest {
  uid: string;
}

@injectable()
export class GetUserInfos implements Usecase<GetUserInfosRequest, Profile> {
  constructor(
    @inject(Identifiers.profileRepositoryRead) private readonly profileRepositoryRead: ProfileRepositoryRead,
  ) {}

  async execute(request: GetUserInfosRequest): Promise<Profile> {
    return await this.profileRepositoryRead.getUserById(request.uid);
  }

  async canExecute(identity: Identity, request: GetUserInfosRequest): Promise<boolean> {
    const scope = identity.roles.find(item => item.scope.name === ServiceName.profile);
    if (!scope) {
      return false;
    }

    if (identity.uid === request.uid && scope.permissions.read === Authorization.self) {
      return true;
    }

    return scope.permissions.read === Authorization.all;
  }
}
