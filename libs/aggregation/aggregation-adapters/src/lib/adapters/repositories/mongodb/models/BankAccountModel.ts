import { BankAccountProperties, BankAccountType, BankAccountUsage } from '@oney/aggregation-core';
import { Currency } from '@oney/common-core';
import { Document, Schema, model } from 'mongoose';

export type BankAccountDoc = BankAccountProperties & Document;

export class BankAccountSchema extends Schema {
  constructor() {
    super(
      {
        id: {
          type: String,
          required: true,
          index: true,
          unique: true,
        },
        userId: {
          type: String,
          required: true,
          index: true,
        },
        name: {
          type: String,
          required: true,
        },
        number: {
          type: String,
          required: true,
        },
        currency: {
          type: Currency,
          required: false,
        },
        balance: {
          type: Number,
          required: true,
        },
        establishment: {
          type: { name: String },
          required: true,
        },
        // iban
        metadatas: {
          type: { iban: String },
          required: true,
        },
        aggregated: {
          type: Boolean,
          required: true,
        },
        type: {
          type: BankAccountType,
          required: true,
        },
        ownerIdentity: {
          type: {
            identity: {
              type: String,
              required: false,
            },
            firstName: {
              type: String,
              required: false,
            },
            lastName: {
              type: String,
              required: false,
            },
            birthDate: {
              type: String,
              required: false,
            },
          },
          required: false,
        },
        isOwnerBankAccount: {
          type: Boolean,
          required: false,
        },
        usage: {
          type: BankAccountUsage,
          required: false,
        },
        ownership: {
          type: String,
          required: false,
        },
        connectionId: {
          type: String,
          required: true,
          index: true,
        },
        bankId: {
          type: String,
          required: true,
          index: true,
        },
      },
      { versionKey: false },
    );
  }
}

const BankAccountIdentifier = 'BankAccounts';

export const BankAccountModel = model<BankAccountDoc>(BankAccountIdentifier, new BankAccountSchema());
