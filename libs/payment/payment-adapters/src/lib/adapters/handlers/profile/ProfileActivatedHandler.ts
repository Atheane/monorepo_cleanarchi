import { DomainEventHandler } from '@oney/ddd';
import { NotifyDiligenceByAggregationToPartner } from '@oney/payment-core';
import { ProfileActivated, ProfileActivationType } from '@oney/profile-messages';
import { inject, injectable } from 'inversify';
import { Logger, SymLogger } from '@oney/logger-core';

@injectable()
export class ProfileActivatedHandler extends DomainEventHandler<ProfileActivated> {
  private readonly handlerName: string;

  constructor(
    @inject(NotifyDiligenceByAggregationToPartner)
    private readonly _notifyDiligenceByAggregationToPartner: NotifyDiligenceByAggregationToPartner,
    @inject(SymLogger)
    private readonly _logger: Logger,
  ) {
    super();
    this.handlerName = this.constructor.name;
  }

  async handle(domainEvent: ProfileActivated): Promise<void> {
    this._logger.info(`${this.handlerName}: received event with event properties: ${domainEvent}`);

    if (domainEvent.props.activationType === ProfileActivationType.AGGREGATION) {
      const { aggregateId } = domainEvent.metadata;
      this._logger.info(
        `${this.handlerName}: executing NotifyDiligenceByAggregationToPartner usecase for uid: ${aggregateId}`,
      );
      await this._notifyDiligenceByAggregationToPartner.execute({ userId: aggregateId });
    }
  }
}
