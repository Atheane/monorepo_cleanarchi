export enum EventOpposedReason {
  NO_OPPOSITION = 0,
  SPECIAL_CONDITION = 7,
  SUSPECTED_FRAUD = 34,
  LOST = 41,
  STOLEN = 43,
  UNFUNDED_ACCOUNT = 51,
}

export type EventOpposedReasonKey = keyof typeof EventOpposedReason;
