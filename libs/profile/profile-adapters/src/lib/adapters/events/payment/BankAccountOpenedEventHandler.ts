import { DomainEventHandler } from '@oney/ddd';
import { BankAccountOpened } from '@oney/payment-messages';
import { ContractGateway, GetCustomerSituations, Identifiers } from '@oney/profile-core';
import { inject, injectable } from 'inversify';
import { Logger, SymLogger } from '@oney/logger-core';

@injectable()
export class BankAccountOpenedEventHandler extends DomainEventHandler<BankAccountOpened> {
  constructor(
    @inject(Identifiers.featureFlagContract) private readonly _featureFlagContract: boolean,
    @inject(Identifiers.contractGateway) private readonly _contractGateway: ContractGateway,
    @inject(Identifiers.getCustomerSituations) private readonly _getCustomerSituations: GetCustomerSituations,
    @inject(SymLogger) private readonly _logger: Logger,
  ) {
    super();
  }

  async handle(domainEvent: BankAccountOpened): Promise<void> {
    this._logger.info(`handling BankAccountOpened event`, domainEvent);
    const uid = domainEvent.props.uid;
    const bankAccountId = domainEvent.props.bid;
    await this._getCustomerSituations.execute({
      uid,
    });

    if (this._featureFlagContract) {
      await this._contractGateway.create({
        uid,
        bankAccountId,
      });
    }
  }
}
