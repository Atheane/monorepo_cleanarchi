import { DomainEventHandler } from '@oney/ddd';
import { SymLogger, Logger } from '@oney/logger-core';
import { BankAccountGateway, ContractGateway, Identifiers, ProfileRepositoryRead } from '@oney/profile-core';
import { inject, injectable } from 'inversify';
import { ContractSigned } from '@oney/profile-messages';

@injectable()
export class ContractSignedHandler extends DomainEventHandler<ContractSigned> {
  constructor(
    @inject(Identifiers.profileRepositoryRead)
    private readonly _profileRepositoryRead: ProfileRepositoryRead,
    @inject(Identifiers.featureFlagContract) private readonly _featureFlagContract: boolean,
    @inject(Identifiers.bankAccountGateway)
    private readonly _bankAccountGateway: BankAccountGateway,
    @inject(Identifiers.contractGateway) private readonly _contractGateway: ContractGateway,
    @inject(SymLogger) private readonly _logger: Logger,
  ) {
    super();
  }

  async handle(domainEvent: ContractSigned): Promise<void> {
    this._logger.info(`handling contract signed event`, domainEvent);
    const profile = await this._profileRepositoryRead.getUserById(domainEvent.metadata.aggregateId);
    if (this._featureFlagContract) {
      const bankAccountId = await this._bankAccountGateway.getId(profile);
      await this._contractGateway.update({
        bankAccountId: bankAccountId,
        date: domainEvent.props.date,
      });
    }
  }
}
