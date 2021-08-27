import { DomainEventHandler } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { UncappingReason, Uncap, UncapCommand } from '@oney/payment-core';
import { CustomBalanceLimitCalculated } from '@oney/cdp-messages';
import { Logger, SymLogger } from '@oney/logger-core';

@injectable()
export class CustomBalanceLimitCalculatedEventHandler extends DomainEventHandler<
  CustomBalanceLimitCalculated
> {
  private readonly handlerName: string;

  constructor(
    private readonly _uncap: Uncap,
    @inject(SymLogger)
    private readonly _logger: Logger,
  ) {
    super();
    this.handlerName = this.constructor.name;
  }

  async handle(domainEvent: CustomBalanceLimitCalculated): Promise<void> {
    this._logger.info(`${this.handlerName}: received event with event properties: `, domainEvent.props);

    const command: UncapCommand = {
      uid: domainEvent.props.uId,
      monthlyGlobalOutAllowance: domainEvent.props.customBalanceLimit,
      eligibility: domainEvent.props.customBalanceLimitEligibility,
      reason: UncappingReason.TAX_STATEMENT,
    };

    await this._uncap.execute(command);
  }
}
