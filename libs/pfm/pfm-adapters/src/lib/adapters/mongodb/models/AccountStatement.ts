import { Document, Schema, Connection, Model } from 'mongoose';
import ShortUniqueId from 'short-unique-id';
import { Direction, AccountStatementProperties, AccountStatementState } from '@oney/pfm-core';

export type AccountStatementDoc = AccountStatementProperties & Document;

export class AccountStatementSchema extends Schema {
  constructor() {
    const uid = new ShortUniqueId({ length: 9 });

    super(
      {
        asid: { type: String, default: uid(), required: true },
        dateFrom: { type: Date, required: true },
        dateTo: { type: Date, required: true },
        documentAvailable: { type: Boolean, required: true, default: false },
        documentState: {
          type: AccountStatementState,
          required: true,
          default: AccountStatementState.UNKNOWN,
        },
        documentStateError: {
          fromBalance: {
            direction: { type: Direction, required: false },
            amount: { type: Number, required: false },
          },
          toBalance: {
            direction: { type: Direction, required: false },
            amount: { type: Number, required: false },
          },
        },
        uid: { type: String, required: true },
        operations: [],
        allCredits: {
          direction: { type: Direction, required: true },
          amount: { type: Number, required: true },
          operationsCount: { type: Number, required: true },
        },
        allDebits: {
          direction: { type: Direction, required: true },
          amount: { type: Number, required: true },
          operationsCount: { type: Number, required: true },
        },
        allCop: {
          direction: { type: Direction, required: true },
          amount: { type: Number, required: true },
        },
        allSctOut: {
          direction: { type: Direction, required: true },
          amount: { type: Number, required: true },
        },
        allSctIn: {
          direction: { type: Direction, required: true },
          amount: { type: Number, required: true },
        },
        allAtm: {
          direction: { type: Direction, required: true },
          amount: { type: Number, required: true },
        },
        fromBalance: {
          direction: { type: Direction, required: true },
          amount: { type: Number, required: true },
        },
        toBalance: {
          direction: { type: Direction, required: true },
          amount: { type: Number, required: true },
        },
      },
      {
        versionKey: false,
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
      },
    );
  }
}

const AccountStatementIdentifier = 'AccountStatement';
let AccountStatementModel: Model<AccountStatementDoc>;
export const connectAccountStatementModel = (connection: Connection): Model<AccountStatementDoc> => {
  AccountStatementModel = connection.model<AccountStatementDoc>(
    AccountStatementIdentifier,
    new AccountStatementSchema(),
  );
  return AccountStatementModel;
};

export const getAccountStatementModel = (): Model<AccountStatementDoc> => AccountStatementModel;
