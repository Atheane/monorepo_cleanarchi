import { User, UserProperties } from '../aggregates/User';

export enum EventSteps {
  PHONE = 'phone',
  CARD_CREATED = 'CARD_CREATED',
  CARD_SENT = 'CARD_SENT',
}

export interface UserData {
  user: User;
  step: EventSteps;
  extraData?: unknown;
}
export type UserUid = Pick<UserProperties, 'uid'>;
export interface GeneratedProvisionRequest {
  provisionRequest: string;
}
export interface GeneratedConsultRequest {
  consultRequest: string;
}
export interface GeneratedEchoRequest {
  echoRequest: string;
}

export interface AuthRequestGenerator<T = object, S = object> {
  generate(requestContext: T): Promise<S>;
}
