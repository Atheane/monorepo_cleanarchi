import { Usecase } from '@oney/ddd';
import { Authorization, Identity, ServiceName } from '@oney/identity-core';
import { EventDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { Identifiers } from '../../Identifiers';
import { ProfileRepositoryRead } from '../../domain/repositories/read/ProfileRepositoryRead';
import { ProfileRepositoryWrite } from '../../domain/repositories/write/ProfileRepositoryWrite';
import { FiscalCountriesList, FiscalCountry } from '../../domain/types/FiscalCountriesList';

@injectable()
export class GetFiscalCountriesList implements Usecase<void, FiscalCountry[]> {
  constructor(
    @inject(Identifiers.profileRepositoryWrite)
    private readonly _profileRepositoryWrite: ProfileRepositoryWrite,
    @inject(Identifiers.profileRepositoryRead) private readonly _profileRepositoryRead: ProfileRepositoryRead,
    @inject(EventDispatcher) private readonly eventDispatcher: EventDispatcher,
  ) {}

  execute(): FiscalCountry[] {
    return FiscalCountriesList;
  }

  canExecute(identity: Identity): boolean {
    const scope = identity.roles.find(item => item.scope.name === ServiceName.profile);
    if (!scope) {
      return false;
    }

    if (scope.permissions.write === Authorization.self && scope.permissions.read === Authorization.self) {
      return true;
    }

    return false;
  }
}
