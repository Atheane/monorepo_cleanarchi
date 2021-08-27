import { PublicProperties } from '../types';

export class BanksAccountsOwner {
  userId: string;

  credential: string;

  constructor(user: PublicProperties<BanksAccountsOwner>) {
    Object.assign(this, user);
  }
}
