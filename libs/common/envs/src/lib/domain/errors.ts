// eslint-disable-next-line max-classes-per-file
class DomainError extends Error {
  cause?: any;

  constructor(message: string, cause?: any) {
    super(message);
    this.name = this.constructor.name;
    this.cause = cause;
  }
}

export namespace EnvError {
  export class EnvNotFound extends DomainError {}
  export class MissingClassDecorator extends DomainError {}
  export class EmptyEnv extends DomainError {}
  export class IncorrectType extends DomainError {}
  export class BadConfigurationError extends DomainError {}
  export class MissingDefaultValue extends DomainError {}
}
