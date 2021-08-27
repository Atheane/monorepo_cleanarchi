import { inject, injectable } from 'inversify';
import { DomainEventHandler } from '@oney/ddd';
import { OtScoringReceived } from '@oney/profile-messages';
import { UpdateProfileScoring } from '@oney/profile-core';
import { Logger, SymLogger } from '@oney/logger-core';

@injectable()
export class ScoringReceivedHandler extends DomainEventHandler<OtScoringReceived> {
  constructor(
    @inject(UpdateProfileScoring) private readonly updateProfileScoring: UpdateProfileScoring,
    @inject(SymLogger) private readonly _logger: Logger,
  ) {
    super();
  }

  async handle(domainEvent: OtScoringReceived): Promise<void> {
    this._logger.info('Received OtScoringReceived event', domainEvent);
    await this.updateProfileScoring.execute(domainEvent);
  }
}
