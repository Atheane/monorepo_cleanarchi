import { Mapper } from '@oney/common-core';
import { Transfer } from '@oney/payment-core';
import { injectable } from 'inversify';
import { TransferDto } from '../dto/TransferDto';

@injectable()
export class TransferMapper implements Mapper<Transfer> {
  fromDomain(raw: Transfer): TransferDto {
    const { props: transferProps } = raw;
    const transferDto: TransferDto = {
      id: transferProps.orderId,
      beneficiary: transferProps.beneficiary,
      sender: transferProps.sender,
      amount: transferProps.amount,
      message: transferProps.message,
      orderId: transferProps.orderId,
      executionDate: transferProps.executionDate,
      tag: transferProps.tag,
    };

    if (raw.hasRecurrence()) {
      transferDto.recurrence = transferProps.recurrence;
    }

    return transferDto;
  }
}
