import { Mapper } from '@oney/common-core';
import { Transfer } from '@oney/payment-core';
import * as moment from 'moment';
import { v4 as uuidV4 } from 'uuid';
import { SmoneyTransferRequest } from '../partners/smoney/models/transfer/SmoneyTransferRequest';

export class SmoneyTransferMapper implements Mapper<Transfer> {
  fromDomain(data: Transfer, reason?: string): SmoneyTransferRequest {
    const payment = data.props;
    const planned =
      moment(payment.executionDate).format('YYYY-MM-DD') === moment(new Date()).format('YYYY-MM-DD');
    return {
      OrderId: uuidV4(),
      BankAccount: {
        id: payment.beneficiary.id,
      },
      Accountid: {
        AppAccountId: payment.sender.id,
      },
      Amount: Math.round(payment.amount * 100),
      Message: payment.message,
      ExecutionDate: moment(payment.executionDate).format('YYYY-MM-DD'),
      Planned: !planned,
      Reference: uuidV4(),
      Motif: reason,
      Recurrent: !payment.recurrence
        ? null
        : {
            RecurrentEndDate: moment(payment.recurrence.endRecurrency).format('YYYY-MM-DD'),
            FrequencyType: payment.recurrence.frequencyType,
            RecurrentDays: payment.recurrence.recurrentDays,
          },
    };
  }
}
