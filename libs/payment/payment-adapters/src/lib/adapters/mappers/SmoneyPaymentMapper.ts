import { Mapper } from '@oney/common-core';
import { Transfer } from '@oney/payment-core';
import * as moment from 'moment';
import { SmoneyPaymentRequest } from '../partners/smoney/models/payment/SmoneyPaymentRequest';

export class SmoneyPaymentMapper implements Mapper<Transfer, SmoneyPaymentRequest> {
  fromDomain(data: Transfer): SmoneyPaymentRequest {
    const payment = data.props;
    return {
      orderid: payment.orderId,
      beneficiary: {
        appaccountid: payment.beneficiary.id,
      },
      sender: {
        appaccountid: payment.sender.id,
      },
      amount: Math.round(payment.amount * 100),
      message: payment.message,
      checkLimits: payment.tag.verifyLimits,
      tag: payment.tag.buildTag(),
      processUnpaid: payment.tag.generateUnpaid,
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
