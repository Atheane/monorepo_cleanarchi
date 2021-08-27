import { OperationVersion } from '../valueobjects/operation/OperationVersion';

export type OperationProperties = {
  orderId: string;
  uid: string;
  cardId?: string;
  tid: string;
  version: OperationVersion[];
};
