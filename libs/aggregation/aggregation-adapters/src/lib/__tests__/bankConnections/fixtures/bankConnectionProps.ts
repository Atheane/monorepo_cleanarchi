import { BankConnectionProperties, ConnectionStateEnum } from '@oney/aggregation-core';

export const bankConnectionProps: BankConnectionProperties = {
  userId: 'userId',
  bankId: 'bankId',
  refId: '22',
  connectionId: 'azeaze',
  active: true,
  state: ConnectionStateEnum.VALID,
  connectionDate: new Date(),
};
