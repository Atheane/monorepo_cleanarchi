/* eslint-disable max-classes-per-file */

export class DomainError extends Error {
  code: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cause?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
  constructor(message: string, cause?: any) {
    super(message);
    this.name = this.constructor.name;
    this.code = this.message;
    this.cause = cause;
  }
}

export namespace SplitSimulationError {
  export class NotFound extends DomainError {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
    constructor(cause?: any) {
      super('SPLIT_SIMULATION_NOT_FOUND', cause);
    }
  }
  export class UnkownSplitProduct extends DomainError {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
    constructor(cause?: any) {
      super('UNKOWN_SPLIT_PRODUCT', cause);
    }
  }
}

export namespace SplitPaymentScheduleError {
  export class NotFound extends DomainError {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
    constructor(cause?: any) {
      super('SPLIT_PAYMENT_SCHEDULE_NOT_FOUND', cause);
    }
  }
}

export namespace SplitContractError {
  export class NotFound extends DomainError {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
    constructor(cause?: any) {
      super('SPLIT_CONTRACT_NOT_FOUND', cause);
    }
  }
}

export namespace CreditorError {
  export class AlreadyExists extends DomainError {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
    constructor(cause?: any) {
      super('ALREADY_EXISTS', cause);
    }
  }
  export class UserNotFound extends DomainError {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
    constructor(cause?: any) {
      super('USER_NOT_FOUND', cause);
    }
  }
}

export namespace RbacError {
  export class UserCannotRead extends DomainError {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
    constructor(cause?: any) {
      super('USER_CANNOT_READ', cause);
    }
  }
  export class UserCannotWrite extends DomainError {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
    constructor(cause?: any) {
      super('USER_CANNOT_WRITE', cause);
    }
  }
}
