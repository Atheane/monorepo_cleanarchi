export class DomainError extends Error {
  code: string;

  cause?: any;

  constructor(message: string, cause?: any) {
    super(message);
    this.name = this.constructor.name;
    this.code = this.message;
    this.cause = cause;
  }
}
