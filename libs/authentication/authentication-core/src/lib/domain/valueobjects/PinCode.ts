import { PublicProperties } from '@oney/common-core';
import { UserError } from '../models/AuthenticationError';

export class PinCode {
  isSet: boolean;

  value?: string;

  deviceId?: string;

  constructor(pinCode?: PublicProperties<PinCode>) {
    if (!this.isSixDigit(pinCode.value)) {
      throw new UserError.NonValidDigitPinCode('MUST_BE_SIX_DIGITS');
    }
    // eslint-disable-next-line no-param-reassign
    pinCode.value = this.serializeValueAndDeviceId(pinCode.deviceId, pinCode.value);
    Object.assign(this, pinCode);
  }

  serializeValueAndDeviceId(deviceId: string, value: string) {
    if (!deviceId || !value) {
      throw new UserError.EmptyDeviceIdOrPinCodeValue('DEVICE_OR_PIN_VALUE_EMPTY');
    }
    return JSON.stringify({ deviceId, value });
  }

  isSixDigit(value: string) {
    return value.length === 6;
  }

  static get(pinCode: PublicProperties<PinCode>): PublicProperties<PinCode> {
    if (!pinCode) {
      return {
        isSet: false,
        deviceId: null,
      };
    }
    return {
      isSet: pinCode.isSet,
      deviceId: pinCode.deviceId,
    };
  }
}
