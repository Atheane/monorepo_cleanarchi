export class Customer {
  uid: string;

  email: string;

  constructor(user?: Customer) {
    Object.assign(this, user);
  }
}
