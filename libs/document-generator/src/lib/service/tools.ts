import { Body } from '../type/Body';

export const CIVILITY = {
  1: 'Monsieur',
  2: 'Madame',
};

export function obfuscatePhoneNumber(phone: string): string {
  const newPhone = phone.replace(phone.substring(0, 3), '0');
  return newPhone.replace(newPhone.substring(2, 8), 'XXXXXX');
}

export function transformPayload(payload: any, path: Body): any {
  const newPayload = { ...payload };
  switch (path) {
    case Body.CONTRAT: {
      newPayload.phone = obfuscatePhoneNumber(newPayload.phone);
      newPayload.honorificCode = CIVILITY[newPayload.honorificCode.toString()];
      newPayload.isPreview = newPayload.signatureDate ? false : true;
      return newPayload;
    }
    /* istanbul ignore next */
    default:
      return payload;
  }
}
