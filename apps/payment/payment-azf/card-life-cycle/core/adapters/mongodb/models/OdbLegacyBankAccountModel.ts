import { Document, Schema, connection } from 'mongoose';
import { DbIdentifier } from './DbIdentifier';

interface CardDbModel {
  cid: string;
  pan: string;
  status: number;
  cardType: number;
  hasPin: boolean;
  uniqueId: string;
  blocked: boolean;
  foreignPayment: boolean;
  internetPayment: boolean;
  atmWeeklyAllowance: number;
  atmWeeklyUsedAllowance: number;
  monthlyAllowance: number;
  monthlyUsedAllowance: number;
}

interface BeneficiaryDbModel {
  bic: string;
  bid: string;
  email: string;
  iban: string;
  name: string;
  status: number;
}

export interface AccountDbModel {
  uid: string;
  bid: string;
  iban: string;
  bic: string;
  cards: CardDbModel[];
  beneficiaries: BeneficiaryDbModel[];
}

export type LegacyBankAccountDoc = AccountDbModel & Document;

export class LegacyBankAccountSchema extends Schema {
  constructor() {
    super(
      {
        uid: {
          type: String,
          required: true,
          index: true,
          unique: true,
        },
        bid: {
          type: String,
          required: true,
        },
        iban: {
          type: String,
          required: true,
        },
        bic: {
          type: String,
          required: true,
        },
        cards: [
          {
            cid: {
              type: String,
              required: true,
              index: true,
              unique: true,
            },
            pan: {
              type: String,
              required: true,
              index: true,
              unique: true,
            },
            status: {
              type: Number,
              required: true,
            },
            cardType: {
              type: Number,
              required: true,
            },
            hasPin: {
              type: Boolean,
              required: true,
            },
            uniqueId: {
              type: String,
              required: true,
            },
            blocked: {
              type: Boolean,
              required: true,
            },
            foreignPayment: {
              type: Boolean,
              required: true,
            },
            internetPayment: {
              type: Boolean,
              required: true,
            },
            atmWeeklyAllowance: {
              type: Number,
              required: true,
            },
            atmWeeklyUsedAllowance: {
              type: Number,
              required: true,
            },
            monthlyAllowance: {
              type: Number,
              required: true,
            },
            monthlyUsedAllowance: {
              type: Number,
              required: true,
            },
          },
        ],
        beneficiaries: [
          {
            bic: {
              type: String,
              required: true,
              index: true,
              unique: true,
            },
            bid: {
              type: String,
              required: true,
            },
            email: {
              type: String,
              required: true,
            },
            iban: {
              type: String,
              required: true,
              unique: true,
            },
            name: {
              type: String,
              required: true,
            },
            status: {
              type: Number,
              required: true,
            },
          },
        ],
      },
      {
        versionKey: false,
      },
    );
  }
}

const AccountIdentifier = 'accounts';
const accountManagement = connection.useDb(DbIdentifier.ODB_ACCOUNT_MANAGEMENT);

export const OdbLegacyBankAccountModel = accountManagement.model<LegacyBankAccountDoc>(
  AccountIdentifier,
  new LegacyBankAccountSchema(),
);
