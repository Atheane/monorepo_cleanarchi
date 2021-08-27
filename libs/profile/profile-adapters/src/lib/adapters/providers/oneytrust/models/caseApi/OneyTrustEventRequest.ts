export enum OneyTrustEventGender {
  MALE = 'M',
  FEMALE = 'F',
  OTHER = 'X',
}

export enum OneytrustEventType {
  DATAMATCHING = 97,
}

export enum OneytrustEventLabel {
  DATAMATCHING = 'DATAMATCHING',
}

export enum OneytrustEventChannel {
  APP = 'APP',
}

export interface BankAccountIdentity {
  identity?: string;
  familyName?: string;
  givenName?: string;
  birthDate?: string;
  bank: string;
}

export interface IdentityData {
  gender: OneyTrustEventGender;
  familyName: string;
  birthName: string;
  givenNames: string;
  birthDate: string;
  pfm: BankAccountIdentity;
}

export interface OneyTrustEventRequest {
  eventReference: string;
  eventType: OneytrustEventType;
  eventLabel: OneytrustEventLabel;
  eventChannel: OneytrustEventChannel;
  masterReference: string;
  data: IdentityData;
}
