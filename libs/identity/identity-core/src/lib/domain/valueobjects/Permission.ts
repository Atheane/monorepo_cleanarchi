import { Authorization } from '../types/Authorization';

export class Permission {
  read: Authorization;
  write: Authorization;

  constructor(permission: Permission) {
    Object.assign(this, permission);
  }
}
