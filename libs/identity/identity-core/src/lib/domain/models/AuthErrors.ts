import { DomainError } from '@oney/common-core';

export namespace AuthErrors {
  export class IdentityErrors extends DomainError {}
  export class IllegalIdentity extends DomainError {}
  export class MalformedHolderIdentity extends DomainError {}
  export class RolesNotFound extends DomainError {}
  export class ScopeNotFound extends DomainError {}
}
