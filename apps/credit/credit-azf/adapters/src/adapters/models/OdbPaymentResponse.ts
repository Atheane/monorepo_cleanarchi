import { TagMapProperties } from './P2PReference';

export type OdbPaymentResponse = {
  id: string;
  amount: number;
  beneficiary: {
    id: string;
  };
  message: string;
  tag: TagMapProperties;
  orderId: string;
  recurrence?: any;
  sender: {
    id: string;
  };
  executionDate: Date;
};
