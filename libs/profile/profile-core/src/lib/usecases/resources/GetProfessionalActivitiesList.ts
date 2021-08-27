import { Usecase } from '@oney/ddd';
import { Authorization, Identity, ServiceName } from '@oney/identity-core';
import { injectable } from 'inversify';
import {
  ProfessionalCategoriesList,
  ProfessionalCategory,
} from '../../domain/types/ProfessionalCategoriesList';

@injectable()
export class GetProfessionalActivitiesList implements Usecase<void, ProfessionalCategory[]> {
  execute(): ProfessionalCategory[] {
    return ProfessionalCategoriesList;
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
