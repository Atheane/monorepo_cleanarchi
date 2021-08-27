import { Direction } from './Direction';

export type DirectionAmount = {
  direction: Direction | string;
  // TO-DO AmountPositive (et peut etre | Amount ?)
  amount: number;
  operationsCount?: number;
};
