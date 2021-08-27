import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { PaymentIdentifier } from '../../PaymentIdentifier';
import { CardProperties } from '../../domain/entities/Card';
import { CardRepositoryRead } from '../../domain/repository/card/CardRepositoryRead';

export class GetCardRequest {
  accountId: string;

  cardId: string;
}

@injectable()
export class GetCard implements Usecase<GetCardRequest, CardProperties> {
  constructor(
    @inject(PaymentIdentifier.cardRepositoryRead) private readonly cardRepositoryRead: CardRepositoryRead,
  ) {}

  async execute(request: GetCardRequest): Promise<CardProperties> {
    return (await this.cardRepositoryRead.findByAccountAndCardId(request.accountId, request.cardId)).props;
  }
}
