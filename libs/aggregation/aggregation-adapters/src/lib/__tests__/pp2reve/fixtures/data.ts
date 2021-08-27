import { TransactionType as AlgoanTransactionType } from '@oney/algoan';

const CATEGORIZED_TRANSACTIONS = {
  id: '5fd9ead3a5ef0014c2fd9022',
  reference: '1222',
  date: new Date('2019-06-30T22:00:00.000Z'),
  amount: 18,
  description: 'Expenses',
  type: AlgoanTransactionType.CHECK,
  category: 'UNKNOWN',
  currency: 'EUR',
  banksUserCardId: 'string',
  userDescription: 'common expenses',
  simplifiedDescription: 'string',
  organizationId: '5fa2b4d0af08f2002a008d96',
  chatflowId: 'none',
  accountId: '5fd9ea8ea5ef00ea86fd9021',
  inserted: false,
  validity: { valid: true },
  algoanType: undefined,
  comments: [],
  algoanCategory: 'FAKE_ALGOAN_CATEGORY',
};

const ALL_USERS = {
  kTDhDRrHv: {
    userId: 'kTDhDRrHv',
    credential: 'credentiel0',
    creditDecisioningUserId: '5fd9ea7fa5ef006d96fd9020',
  },
  '000000000': {
    userId: '000000000',
    credential: 'credentiel1',
  },
  111111111: {
    userId: '111111111',
    credential: 'credentiel2',
    creditDecisioningUserId: '5fca336d96c9b410a1688d4z',
  },
  222222222: {
    userId: '222222222',
    credential: 'credentiel3',
    creditDecisioningUserId: '5fd8a814a5ef007e89fd8f88',
  },
};

export { CATEGORIZED_TRANSACTIONS, ALL_USERS };
