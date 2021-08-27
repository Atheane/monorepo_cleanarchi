export enum EventCardTypes {
  CLASSIC_VIRTUAL = 1,
  CLASSIC_PHYSICAL = 2,
  PREMIUM_VIRTUAL = 3,
  PREMIUM_PHYSICAL = 4,
}

export type EventCardTypesKey = keyof typeof EventCardTypes;
