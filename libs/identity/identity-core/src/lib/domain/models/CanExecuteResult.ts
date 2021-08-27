export enum CanExecuteResultEnum {
  SCA_NEEDED = 'AUTH_NEEDED',
  NOT_AUTHORIZED = 'NOT_AUTHORIZED',
  ACCESS_GRANTED = 'ACCESS_GRANTED',
}

interface ScaPayload {
  payload: any;
  actionType: string;
}

function toStr(request: any): string {
  const stringifyTypes = ['number', 'object', 'boolean'];
  if (!request) {
    return null;
  }
  if (typeof request === 'string') {
    return request;
  }

  if (stringifyTypes.includes(typeof request)) {
    return JSON.stringify(request);
  }
}

export class CanExecuteResult {
  public readonly result: CanExecuteResultEnum;
  public readonly scaPayload?: ScaPayload;

  constructor(result: CanExecuteResultEnum, actionType?: ScaPayload) {
    this.result = result;
    this.scaPayload = actionType;
  }

  static can(): CanExecuteResult {
    return new CanExecuteResult(CanExecuteResultEnum.ACCESS_GRANTED);
  }
  static cannot(): CanExecuteResult {
    return new CanExecuteResult(CanExecuteResultEnum.NOT_AUTHORIZED);
  }

  static sca_needed(scaPayload: ScaPayload): CanExecuteResult {
    return new CanExecuteResult(CanExecuteResultEnum.SCA_NEEDED, {
      actionType: scaPayload.actionType,
      payload: toStr(scaPayload.payload),
    });
  }
}
