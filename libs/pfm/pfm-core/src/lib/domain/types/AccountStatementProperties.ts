import { DirectionAmount } from './DirectionAmount';
import { Operation } from './Operation';
import { AccountStatementState } from './AccountStatementState';

export interface AccountStatementProperties {
  asid?: string;
  // TODO remove field date, (its an update for the front)
  date?: Date;
  // TODO remove field id, (its an update for the front)
  id?: string;
  dateFrom?: Date;
  dateTo?: Date;
  documentAvailable?: boolean;
  documentState?: AccountStatementState;
  documentStateError?: {
    fromBalance?: DirectionAmount;
    toBalance?: DirectionAmount;
  };
  uid?: string;
  operations?: Operation[];
  allCredits?: DirectionAmount;
  allDebits?: DirectionAmount;
  allCop?: DirectionAmount;
  allSctOut?: DirectionAmount;
  allSctIn?: DirectionAmount;
  allAtm?: DirectionAmount;
  fromBalance?: DirectionAmount;
  toBalance?: DirectionAmount;
}
