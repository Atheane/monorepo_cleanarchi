export interface Action {
  type: string;
  payload: string;
}

export enum AuthFactor {
  OTP = 'otp',
}

export enum AuthStatus {
  PENDING = 'PENDING',
  DONE = 'DONE',
  EXPIRED = 'EXPIRED',
  FAILED = 'FAILED',
  BLOCKED = 'BLOCKED',
}

export enum Channel {
  SMS = 'sms',
}

export interface ScaVerifier {
  consumedAt: Date;
  verifierId: string;
  status: AuthStatus;
  valid: boolean;
  factor: AuthFactor;
  channel: Channel;
  action: Action;
  otp?: string;
  expiredAt?: Date;
  scaToken?: string;
}
