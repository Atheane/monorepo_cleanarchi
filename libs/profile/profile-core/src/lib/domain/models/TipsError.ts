import { DomainError } from '@oney/common-core';

export namespace TipsErrors {
  export class IfCaseNotImplemented extends DomainError {}
  export class NoTipsForUser extends DomainError {}
}
