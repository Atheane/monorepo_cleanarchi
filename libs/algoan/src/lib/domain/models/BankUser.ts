import { Aden } from './Aden/Aden';
import { Id } from './Id';

export type BankUser = Id & BankUserProperties;

export type BankUserProperties = {
  status?: BankUserStatus;
  adenTriggers?: AdenTriggers;
  aden?: Aden[];
  scoreTriggers?: {};
  scores?: [];
};

export type AdenTriggers = {
  onSynchronizationFinished?: boolean;
};

export enum BankUserStatus {
  NEW = 'NEW',
  FINISHED = 'FINISHED',
}
