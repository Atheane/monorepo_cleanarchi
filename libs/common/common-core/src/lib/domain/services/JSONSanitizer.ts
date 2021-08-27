import { pickBy } from 'lodash';

export class JSONSanitizer {
  static sanitizeJson<T>(payload: Record<string, any>): T {
    return (pickBy(payload, v => v !== undefined || v !== null) as unknown) as T;
  }
  // https://dev.to/alwarg/purging-unwanted-properties-in-js-object-45ol
  static cleanEmpty<T>(obj: T): T {
    const stringfiedObj = JSON.stringify(obj, (key, value) => {
      return ['', null].includes(value) ||
        (typeof value === 'object' && (value.length === 0 || Object.keys(value).length === 0))
        ? undefined
        : value;
    });
    const resObj = JSON.parse(stringfiedObj);
    const isEmptyPropsPresent = ['{}', '[]', '""', 'null'].some(key => stringfiedObj.includes(key));
    if (isEmptyPropsPresent) {
      return JSONSanitizer.cleanEmpty(resObj);
    }
    return resObj;
  }
}
