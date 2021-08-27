export class DomainError extends Error {
  message: string;
  cause?: any;
  safeMessage?: string;
  code?: string;

  constructor(message: string, cause?: any, safeMessage?: string) {
    super(message);
    this.name = this.constructor.name;
    this.cause = cause;
    this.safeMessage = safeMessage;
  }
}

export namespace GenericError {
  export class MethodNotImplemented extends DomainError {}
  export class ApiResponseError extends DomainError {}
}

export namespace EnvError {
  export class EnvNotFound extends DomainError {}
  export class MissingClassDecorator extends DomainError {}
  export class EmptyEnv extends DomainError {}
  export class IncorrectType extends DomainError {}
  export class BadConfigurationError extends DomainError {}
  export class MissingDefaultValue extends DomainError {}
}
