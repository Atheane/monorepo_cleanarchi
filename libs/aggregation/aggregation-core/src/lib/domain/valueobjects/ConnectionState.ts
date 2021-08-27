import { BankConnectionError } from '../models/BankConnectionErrors';

export enum ConnectionStateEnum {
  VALID = 'valid',
  SCA = 'sca',
  DECOUPLED = 'decoupled',
  MORE_INFORMATION = 'moreInformation',
  ACTION_NEEDED = 'actionNeeded',
  ERROR = 'error',
  PASSWORD_EXPIRED = 'passwordExpired',
  VALIDATING = 'validating',
}

export class ConnectionState {
  private state: ConnectionStateEnum;

  constructor(_state: ConnectionStateEnum) {
    if (Object.values(ConnectionStateEnum).includes(_state)) {
      this.state = _state;
    } else {
      throw new BankConnectionError.StateUnknown();
    }
  }

  get value(): { state: ConnectionStateEnum } {
    return { state: this.state };
  }
}
