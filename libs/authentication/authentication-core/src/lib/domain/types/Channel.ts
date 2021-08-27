export enum Channel {
  SMS = 'sms',
  EMAIL = 'email',
}

export type EmailPayload = {
  token: string;
  otp: string;
  email: string;
};

export type Payload<T> = T extends Channel.EMAIL ? EmailPayload : T;
