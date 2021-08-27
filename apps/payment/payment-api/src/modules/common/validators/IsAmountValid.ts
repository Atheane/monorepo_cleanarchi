/* eslint-disable */
import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsAmountValid(validationOptions?: ValidationOptions) {
  return function (target: Object, propertyName: string) {
    registerDecorator({
      name: 'isAmountValid',
      target: target.constructor,
      propertyName,
      options: {
        ...validationOptions,
        message: 'Amount is not valid (e.g 25.55)',
      },
      validator: {
        validate(value: any) {
          const amount: number = value;
          const isAmountWithTwoDigits = amount.toString().split('.');
          if (isAmountWithTwoDigits.length >= 2) {
            return isAmountWithTwoDigits[1].length <= 2;
          }
          return true;
        },
      },
    });
  };
}
