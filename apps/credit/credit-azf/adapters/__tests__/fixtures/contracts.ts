import { ScheduleKey } from '@oney/credit-messages';
import { ContractStatus, SplitProduct } from '../../../core/src/domain/types';

export const contracts = [
  {
    contractNumber: 'azeaze',
    userId: 'K-oZktdWv',
    bankAccountId: '1388',
    initialTransactionId: 'azeacabjshkj',
    productCode: SplitProduct.DF003,
    subscriptionDate: new Date('1994-04-21T00:00:00.000Z'),
    apr: 0.1926,
    status: ContractStatus.IN_PROGRESS,
    initialPaymentSchedule: {
      immediatePayments: [
        {
          key: ScheduleKey.FEE,
          amount: 5.79,
          dueDate: new Date('1994-04-21T00:00:00.000Z'),
        },
        {
          key: ScheduleKey.M1,
          amount: 133,
          dueDate: new Date('1994-04-21T00:00:00.000Z'),
        },
      ],
      deferredPayments: [
        {
          key: ScheduleKey.M2,
          amount: 133,
          dueDate: new Date('1994-05-21T00:00:00.000Z'),
        },
        {
          key: ScheduleKey.M3,
          amount: 133,
          dueDate: new Date('1994-06-21T00:00:00.000Z'),
        },
      ],
    },
  },
  {
    contractNumber: 'kqsdkjhqsdhjk',
    userId: 'K-oZktdWv',
    bankAccountId: '1388',
    initialTransactionId: 'bqkjjhk',
    productCode: SplitProduct.DF003,
    subscriptionDate: new Date('1994-05-21T00:00:00.000Z'),
    apr: 0.1926,
    status: ContractStatus.IN_PROGRESS,
    initialPaymentSchedule: {
      immediatePayments: [
        {
          key: ScheduleKey.FEE,
          amount: 5.79,
          dueDate: new Date('1994-05-21T00:00:00.000Z'),
        },
        {
          key: ScheduleKey.M1,
          amount: 133,
          dueDate: new Date('1994-05-21T00:00:00.000Z'),
        },
      ],
      deferredPayments: [
        {
          key: ScheduleKey.M2,
          amount: 133,
          dueDate: new Date('1994-06-21T00:00:00.000Z'),
        },
        {
          key: ScheduleKey.M3,
          amount: 133,
          dueDate: new Date('1994-07-21T00:00:00.000Z'),
        },
      ],
    },
  },
  {
    contractNumber: 'azeazeaezqsdaz',
    userId: 'zCDOH_UvA',
    bankAccountId: '3177',
    initialTransactionId: 'jhhkjhjiuy',
    productCode: SplitProduct.DF004,
    subscriptionDate: new Date('1994-02-21T00:00:00.000Z'),
    apr: 1.5087,
    status: ContractStatus.IN_PROGRESS,
    initialPaymentSchedule: {
      immediatePayments: [
        {
          key: ScheduleKey.FEE,
          amount: 6.6,
          dueDate: new Date('1994-02-21T00:00:00.000Z'),
        },
        {
          key: ScheduleKey.M1,
          amount: 75,
          dueDate: new Date('1994-02-21T00:00:00.000Z'),
        },
      ],
      deferredPayments: [
        {
          key: ScheduleKey.M2,
          amount: 75,
          dueDate: new Date('1994-03-21T00:00:00.000Z'),
        },
        {
          key: ScheduleKey.M3,
          amount: 75,
          dueDate: new Date('1994-04-21T00:00:00.000Z'),
        },
        {
          key: ScheduleKey.M4,
          amount: 75,
          dueDate: new Date('1994-05-21T00:00:00.000Z'),
        },
      ],
    },
  },
];
