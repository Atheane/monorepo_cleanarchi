import { Mapper } from '@oney/common-core';
import {
  Authorization,
  Identity,
  IdentityProvider,
  Permission,
  Scope,
  ServiceName,
} from '@oney/identity-core';
import { injectable } from 'inversify';

@injectable()
export class AzureIdentityMapper implements Mapper<Identity> {
  toDomain(raw: any): Identity {
    const { appid } = raw;
    const rawRoles = raw.roles as string[];
    const roles: { service: ServiceName; read?: Authorization; write?: Authorization }[] = [];
    if (rawRoles) {
      rawRoles.map(item => {
        const listedPermission = ['read', 'write'];
        const service = ServiceName[item.split('.')[0].toLowerCase()];
        const permission = item.split('.').splice(1, 1).join('').toLowerCase();
        const autorization = item.split('.').splice(2, 2).join('').toLowerCase();
        if (autorization !== 'self' && service != null && listedPermission.includes(permission)) {
          const isServiceExist = roles.filter(item => item.service === service);
          if (isServiceExist.length > 0) {
            isServiceExist[0][permission] = Authorization[autorization];
          } else {
            roles.push({
              service,
              [permission]: Authorization[autorization],
            });
          }
        }
      });
    } // !item.write is ignore in coverage, cause we need a token with only a permission of read or write for example.
    // We create the roles and permission based on what we have
    // In roles.
    /* istanbul ignore next */ return {
      provider: IdentityProvider.azure,
      uid: appid, // Client id of azure token provided.
      roles:
        roles.length <= 0
          ? []
          : roles.map(item => {
              return {
                scope: new Scope({
                  name: item.service,
                }),
                permissions: new Permission({
                  write: !item.write ? Authorization.denied : item.write,
                  read: !item.read ? Authorization.denied : item.read,
                }),
              };
            }),
      name: null,
    };
  }
}
