export enum EventActionCodes {
  CREATION = 0,
  CANCELLATION = 1,
  REFABRICATION = 2,
  RENEWAL = 3,
  UPDATE = 4,
}

export type EventActionCodesKey = keyof typeof EventActionCodes;
