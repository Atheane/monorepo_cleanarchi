import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { PaymentIdentifier } from '../../PaymentIdentifier';
import { CardProperties } from '../../domain/entities/Card';
import { CardRepositoryRead } from '../../domain/repository/card/CardRepositoryRead';

export class GetCardsRequest {
  accountId: string;
}

@injectable()
export class GetCards implements Usecase<GetCardsRequest, CardProperties[]> {
  constructor(
    @inject(PaymentIdentifier.cardRepositoryRead) private readonly cardRepositoryRead: CardRepositoryRead,
  ) {}

  async execute(request: GetCardsRequest): Promise<CardProperties[]> {
    return (await this.cardRepositoryRead.getAll({ ownerId: request.accountId })).map(item => item.props);
  }
}
