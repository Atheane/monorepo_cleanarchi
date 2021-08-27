import { Authorization, IdentityProvider, Permission, Scope, ServiceName } from '@oney/identity-core';
import { injectable } from 'inversify';

export class AzureClientIds {
  pp_de_reve: string;
  oney_compta: string;
}

export interface RoleInMemoryDb {
  id: string;
  name: string;
  provider: IdentityProvider;
  roles: { scope: Scope; permissions: Permission }[];
}

@injectable()
export class RolesDictionnary {
  constructor(private readonly _clientIds: AzureClientIds) {}

  getRoles(): RoleInMemoryDb[] {
    return [
      {
        id: this._clientIds.pp_de_reve, // ClientId from AzureAd Token.
        name: 'pp_de_reve',
        provider: IdentityProvider.azure,
        roles: [
          {
            scope: new Scope({
              name: ServiceName.aggregation,
            }),
            permissions: new Permission({
              write: Authorization.self,
              read: Authorization.self,
            }),
          },
        ],
      },
      {
        id: this._clientIds.oney_compta, // ClientId from AzureAd Token.
        name: 'oney_compta',
        provider: IdentityProvider.azure,
        roles: [
          {
            scope: new Scope({
              name: ServiceName.credit,
            }),
            permissions: new Permission({
              write: Authorization.denied,
              read: Authorization.all,
            }),
          },
        ],
      },
      {
        id: ServiceName.payment,
        name: ServiceName.payment,
        provider: IdentityProvider.odb,
        roles: [
          {
            scope: new Scope({
              name: ServiceName.profile,
            }),
            permissions: new Permission({
              write: Authorization.denied,
              read: Authorization.all,
            }),
          },
          {
            scope: new Scope({
              name: ServiceName.credit,
            }),
            permissions: new Permission({
              write: Authorization.denied,
              read: Authorization.all,
            }),
          },
        ],
      },
      {
        id: ServiceName.authentication,
        name: ServiceName.authentication,
        provider: IdentityProvider.odb,
        roles: [
          {
            scope: new Scope({
              name: ServiceName.profile,
            }),
            permissions: new Permission({
              write: Authorization.all,
              read: Authorization.all,
            }),
          },
        ],
      },
      {
        id: ServiceName.aggregation,
        name: ServiceName.aggregation,
        provider: IdentityProvider.odb,
        roles: [
          {
            scope: new Scope({
              name: ServiceName.profile,
            }),
            permissions: new Permission({
              write: Authorization.denied,
              read: Authorization.all,
            }),
          },
        ],
      },
      {
        id: ServiceName.profile,
        name: ServiceName.profile,
        provider: IdentityProvider.odb,
        roles: [
          {
            scope: new Scope({
              name: ServiceName.payment,
            }),
            permissions: new Permission({
              write: Authorization.all,
              read: Authorization.all,
            }),
          },
        ],
      },
      {
        id: ServiceName.pfm,
        name: ServiceName.pfm,
        provider: IdentityProvider.odb,
        roles: [
          {
            scope: new Scope({
              name: ServiceName.payment,
            }),
            permissions: new Permission({
              write: Authorization.denied,
              read: Authorization.all,
            }),
          },
        ],
      },
      {
        id: null, // Specific case where we retrieve the user roles.
        name: 'user',
        provider: IdentityProvider.odb,
        roles: [
          {
            scope: new Scope({
              name: ServiceName.profile,
            }),
            permissions: new Permission({
              write: Authorization.self,
              read: Authorization.self,
            }),
          },
          {
            scope: new Scope({
              name: ServiceName.aggregation,
            }),
            permissions: new Permission({
              write: Authorization.self,
              read: Authorization.self,
            }),
          },
          {
            scope: new Scope({
              name: ServiceName.notifications,
            }),
            permissions: new Permission({
              write: Authorization.denied,
              read: Authorization.self,
            }),
          },
          {
            scope: new Scope({
              name: ServiceName.credit,
            }),
            permissions: new Permission({
              write: Authorization.self,
              read: Authorization.self,
            }),
          },
          {
            scope: new Scope({
              name: ServiceName.authentication,
            }),
            permissions: new Permission({
              write: Authorization.self,
              read: Authorization.self,
            }),
          },
          {
            scope: new Scope({
              name: ServiceName.payment,
            }),
            permissions: new Permission({
              write: Authorization.self,
              read: Authorization.self,
            }),
          },
          {
            scope: new Scope({
              name: ServiceName.account,
            }),
            permissions: new Permission({
              write: Authorization.self,
              read: Authorization.self,
            }),
          },
          {
            scope: new Scope({
              name: ServiceName.pfm,
            }),
            permissions: new Permission({
              write: Authorization.self,
              read: Authorization.self,
            }),
          },
          {
            scope: new Scope({
              name: ServiceName.subscription,
            }),
            permissions: new Permission({
              write: Authorization.self,
              read: Authorization.self,
            }),
          },
        ],
      },
    ];
  }
}
