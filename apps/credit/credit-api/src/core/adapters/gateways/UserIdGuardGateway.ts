import { atob } from 'atob';
import { injectable } from 'inversify';
import { GuardGateway } from '@oney/credit-core';

@injectable()
export class UserIdGuardGateway implements GuardGateway {
  checkUserId(userId: string, userToken: string): boolean {
    const base64Url = userToken.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const {
      payload: {
        user: { uid },
      },
    } = JSON.parse(atob(base64));
    return userId === uid;
  }
}
