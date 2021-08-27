/* eslint-disable */
export function getEnumKeyByEnumValue<T>(myEnum, enumValue: string | number): T {
  const key = Object.keys(myEnum).find(x => myEnum[x] === enumValue);
  return key as any;
}

export function isEnumKey(myEnum: any, value: any): boolean {
  return Object.keys(myEnum).includes(value);
}

export function isEnumValue<T>(myEnum: T, value): value is T {
  return Object.values(myEnum).includes(value);
}
