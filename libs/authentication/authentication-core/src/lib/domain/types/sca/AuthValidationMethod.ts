export interface AuthValidationMethod {
  type: string;
  id: string;
}

export interface OtpSmsAuthMethod extends AuthValidationMethod {
  maxSize: number;
  minSize: number;
  phoneNumber: string;
}

export interface PinAuthMethod extends AuthValidationMethod {
  asynchronousWaitingTime: string;
  cloudCardRequestId: string;
  requestTimeToLive: number;
}
