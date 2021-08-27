import { ContractStatus, SplitProduct, PaymentStatus } from '../../../core/src/domain/types';

export const failingPayments = {
  id: 'paymentScheduleId1',
  bankAccountId: '1388',
  userId: 'zzaazazaz',
  status: ContractStatus.IN_PROGRESS,
  contractNumber: 'azeaze',
  productCode: SplitProduct.DF003,
  fundingExecution: {
    key: 'funding',
    amount: 399,
    dueDate: new Date('1994-04-21T00:00:00.000Z'),
    status: PaymentStatus.PAID,
    transactionId: 'CDCEDE14204',
    paymentDate: new Date('1994-04-21T00:00:00.000Z'),
  },
  paymentsExecution: [
    {
      key: 'fee',
      amount: 5.79,
      dueDate: new Date('1994-04-21T00:00:00.000Z'),
      status: PaymentStatus.PAID,
      transactionId: 'DDFEDE10232',
      paymentDate: new Date('1994-04-21T00:00:00.000Z'),
    },
    {
      key: '001',
      amount: 133,
      dueDate: new Date('1994-04-21T00:00:00.000Z'),
      status: PaymentStatus.PAID,
      transactionId: 'BDDBFC13014',
      paymentDate: new Date('1994-04-21T00:00:00.000Z'),
    },
    {
      key: '002',
      amount: 133,
      dueDate: new Date('1994-05-21T00:00:00.000Z'),
      status: PaymentStatus.TODO,
    },
    {
      key: '003',
      amount: 133,
      dueDate: new Date('1994-06-21T00:00:00.000Z'),
      status: PaymentStatus.TODO,
    },
  ],
};
