import { ScheduleKey } from './ScheduleKey';

export type PaymentDue = {
  key: ScheduleKey;
  amount: number;
  dueDate: Date;
};
