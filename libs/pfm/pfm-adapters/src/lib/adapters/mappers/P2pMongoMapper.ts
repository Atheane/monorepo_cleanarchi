import { Mapper } from '@oney/common-core';
import { injectable } from 'inversify';
import { P2p } from '@oney/pfm-core';
import { P2pDoc } from '../mongodb/models/P2p';

@injectable()
export class P2pMongoMapper implements Mapper<P2p, P2pDoc> {
  toDomain(raw: P2pDoc): P2p {
    const {
      beneficiary,
      sender,
      tag,
      recurrence,
      id,
      orderId,
      message,
      amount,
      date,
      /* eslint-disable-next-line */
      _id,
    } = raw;
    return new P2p({
      beneficiary,
      sender,
      tag,
      recurrence,
      id,
      orderId,
      message,
      amount,
      date: date ? new Date(date) : _id.getTimestamp(),
    });
  }
}
