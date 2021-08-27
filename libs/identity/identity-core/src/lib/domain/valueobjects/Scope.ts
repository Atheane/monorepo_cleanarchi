import { ServiceName } from '../types/ServiceName';

export class Scope {
  name: ServiceName;

  constructor(scope: Scope) {
    Object.assign(this, scope);
  }
}
