import { Mapper } from '@oney/common-core';
import { Card } from '@oney/payment-core';
import { injectable } from 'inversify';
import { CardDTO } from '../dto/CardDTO';

@injectable()
export class CardMapper implements Mapper<Card, CardDTO> {
  fromDomain(raw: Card): CardDTO {
    return { ...raw.props };
  }
}
