import { SplitProduct } from '@oney/common-adapters';
import { ContractStatus, SplitPaymentScheduleCreatedProperties, PaymentStatus } from '@oney/credit-messages';

export const SplitPaymentScheduleCreatedPropsMocked: SplitPaymentScheduleCreatedProperties = {
  id: '029b5ea7-f8ad-4b6f-bcdb-4d5854f605bf',
  contractNumber: 'DEBFFC021253',
  bankAccountId: '2223',
  status: ContractStatus.IN_PROGRESS,
  userId: 'cmOMKSApM',
  productCode: SplitProduct.DF003,
  label: 'merchant name',
  apr: 0.1926,
  fundingExecution: {
    key: 'funding',
    amount: 15,
    dueDate: new Date('2021-04-13T01:09:42.080Z'),
    status: PaymentStatus.PAID,
    paymentDate: new Date('2021-04-13T01:09:42.817Z'),
    transactionId: 'EAEBAA04031',
  },
  paymentsExecution: [
    {
      key: 'fee',
      amount: 0.22,
      dueDate: new Date('2021-04-13T01:09:30.335Z'),
      status: PaymentStatus.PAID,
      paymentDate: new Date('2021-04-13T01:09:43.983Z'),
      transactionId: 'DDCAEF34412',
    },
    {
      key: '001',
      amount: 5,
      dueDate: new Date('2021-04-13T01:09:30.335Z'),
      status: PaymentStatus.PAID,
      paymentDate: new Date('2021-04-13T01:09:45.116Z'),
      transactionId: 'BDABDB32214',
    },
    { key: '002', amount: 5, dueDate: new Date('2021-05-13T01:09:30.335Z'), status: PaymentStatus.PAID },
    { key: '003', amount: 5, dueDate: new Date('2021-06-13T01:09:30.335Z'), status: PaymentStatus.PAID },
  ],
};

export const SplitPaymentScheduleCreatedMocked = {
  id: 'id123',
  props: SplitPaymentScheduleCreatedPropsMocked,
};
