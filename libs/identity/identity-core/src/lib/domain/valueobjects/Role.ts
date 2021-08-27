import { Permission } from './Permission';
import { Scope } from './Scope';

export interface Role {
  scope: Scope;
  permissions: Permission;
}
