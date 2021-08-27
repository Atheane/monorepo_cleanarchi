export enum OriginService {
  ODB_AUTHENTICATION = 'ODB_AUTHENTICATION',
  ODB_ACCOUNT_MANAGEMENT = 'ODB_ACCOUNT_MANAGEMENT',
}

export class Event<T> {
  readonly origin: OriginService = OriginService.ODB_AUTHENTICATION;

  id: string;

  data: T;

  version: number;

  constructor(event: Omit<Event<T>, 'origin'>) {
    return Object.assign(this, event);
  }
}
