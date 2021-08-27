import { AccountProperties, LoanDetails } from '../../domain/models/Account';
import { TransactionProperties } from '../../domain/models/Transaction';

const aTransactionProperties = {
  reference: '1222',
  date: new Date('2019-06-30T22:00:00.000Z'),
  amount: 20,
  description: 'Expenses',
  type: 'CHECK',
  category: 'UNKNOWN',
  currency: 'EUR',
  banksUserCardId: 'string',
  userDescription: 'common expenses',
  simplifiedDescription: 'string',
} as TransactionProperties;

const anAccountProperties = {
  reference: '42',
  bank: "Caisse d'Épargne",
  balance: 3564.5,
  balanceDate: new Date('2019-06-30T22:00:00.000Z'),
  status: 'ACTIVE',
  type: 'CHECKINGS',
  connectionSource: 'LINXO',
  currency: 'EUR',
  iban: 'FR7630001007941234567890185',
  bic: 'BDFEFR2T',
  name: 'compte de pierre paul jacques',
  usage: 'PERSONAL',
  savingsDetails: 'CEL',
  loanDetails: {
    type: 'AUTO',
    amount: 10000,
    startDate: new Date(1560327979),
    endDate: new Date(1560327979),
    payment: 10,
    remainingCapital: 1000,
    interestRate: 14.56,
    debitedAccountId: 'string',
  } as LoanDetails,
} as AccountProperties;

const algoanGetAllAccountsTransactionsData = [
  {
    id: '42',
    refId: '6066fdf5c96248acec78b6f8',
    transactions: [
      {
        id: '6066fe20c96248137b78b6f9',
        reference: '1222',
        date: new Date('2019-06-30T22:00:00.000Z'),
        amount: 20,
        description: 'Expenses',
        type: 'CHECK',
        category: 'UNKNOWN',
        currency: 'EUR',
        banksUserCardId: 'string',
        userDescription: 'common expenses',
        simplifiedDescription: 'string',
        algoanCategory: undefined,
        organizationId: undefined,
        chatflowId: undefined,
        accountId: '6066fdf5c96248acec78b6f8',
        inserted: false,
        validity: { valid: true },
        algoanType: undefined,
        comments: [],
        referenceAccound: '42',
      },
    ],
  },
];

export { algoanGetAllAccountsTransactionsData, aTransactionProperties, anAccountProperties };
