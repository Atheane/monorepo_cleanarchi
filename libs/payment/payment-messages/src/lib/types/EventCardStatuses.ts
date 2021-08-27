export enum EventCardStatuses {
  ORDERED = 0,
  SENT = 1,
  ACTIVATED = 2,
  EXPIRED = 3,
  OPPOSED = 4,
  FAILED = 5,
  DEACTIVATED = 6,
  CANCELLED = 7,
}

export type EventCardStatusesKey = keyof typeof EventCardStatuses;
