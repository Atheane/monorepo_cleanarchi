import { Mapper } from '@oney/common-core';
import { IdentityProvider, Identity } from '@oney/identity-core';
import { injectable } from 'inversify';

@injectable()
export class OdbIdentityMapper implements Mapper<Identity> {
  toDomain(raw: any): Identity {
    const {
      payload: {
        user: { uid, email },
      },
      roles,
    } = raw;

    // Here we check that we have not signed a token with specific ACL.
    return {
      provider: IdentityProvider.odb,
      uid: uid,
      email,
      roles: !roles ? [] : roles,
      name: IdentityProvider.odb,
    };
  }

  fromDomain(t: Identity): any {
    return {
      payload: {
        user: {
          uid: t.uid,
          email: t.email,
        },
      },
      provider: IdentityProvider.odb,
      roles: t.roles,
      name: t.name,
    };
  }
}
