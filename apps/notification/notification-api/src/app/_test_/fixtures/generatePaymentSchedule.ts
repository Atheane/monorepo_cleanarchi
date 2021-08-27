import {
  ContractStatus,
  PaymentStatus,
  SplitPaymentScheduleCreatedProperties,
  SplitProduct,
} from '@oney/credit-messages';
import * as fs from 'fs';

export const splitPaymentScheduleCreatedProperties: SplitPaymentScheduleCreatedProperties = {
  label: 'label',
  id: '5f123d7a-b6ad-4d7f-b8ce-88fbc07f55b6',
  contractNumber: '73RHCQLfy',
  bankAccountId: '1380',
  status: ContractStatus.IN_PROGRESS,
  userId: 'kTDhDRrHv',
  productCode: SplitProduct.DF004,
  apr: 1.5087,
  fundingExecution: {
    key: 'funding',
    amount: 1,
    dueDate: new Date('2020-11-08T09:19:25.217Z'),
    status: PaymentStatus.TODO,
  },
  paymentsExecution: [
    {
      key: 'fee',
      amount: 0.02,
      dueDate: new Date('2020-11-08T09:18:45.030Z'),
      status: PaymentStatus.TODO,
    },
    {
      key: '001',
      amount: 0.25,
      dueDate: new Date('2020-11-08T09:18:45.030Z'),
      status: PaymentStatus.TODO,
    },
    {
      key: '002',
      amount: 0.25,
      dueDate: new Date('2020-12-08T09:18:45.030Z'),
      status: PaymentStatus.TODO,
    },
    {
      key: '003',
      amount: 0.25,
      dueDate: new Date('2021-01-08T09:18:45.030Z'),
      status: PaymentStatus.TODO,
    },
    {
      key: '004',
      amount: 0.25,
      dueDate: new Date('2021-02-08T09:18:45.030Z'),
      status: PaymentStatus.TODO,
    },
  ],
};

export const content = fs.readFileSync(`${__dirname}/content.txt`, 'utf8');
export const footer = fs.readFileSync(`${__dirname}/footer.txt`, 'utf8');
export const pdfOptions = {
  marginBottom: '2cm',
  enableSmartShrinking: true,
  marginLeft: 20,
  marginRight: 20,
};
