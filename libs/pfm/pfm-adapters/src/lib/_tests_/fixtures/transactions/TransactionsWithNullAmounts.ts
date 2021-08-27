import { AmountPositive, Direction, TransactionStatus, TransactionType } from '@oney/pfm-core';

export const TransactionsWithNullAmounts = [
  {
    refId: '163154',
    bankAccountId: '8605',
    amount: new AmountPositive(20),
    originalAmount: null,
    date: new Date(),
    conversionRate: 0.89,
    currency: null,
    direction: Direction.OUT,
    rejectionReason: null,
    status: TransactionStatus.PENDING,
    type: TransactionType.CARD,
    label: 'Opération Carte',
    fees: new AmountPositive(20),
    card: {
      cardId: null,
      pan: null,
      merchant: null,
    },
  },
];
