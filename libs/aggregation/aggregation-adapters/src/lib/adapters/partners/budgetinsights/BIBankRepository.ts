import { defaultLogger } from '@oney/logger-adapters';
import { inject, injectable } from 'inversify';
import { BankRepository, BankError, AggregationIdentifier, Bank } from '@oney/aggregation-core';
import { BIConnectionService } from './BIConnectionService';
import { selectedAccountTypes } from './models';
import { BIConnector } from './models/Connector';
import { BankMapper } from '../../mappers/BankMapper';

@injectable()
export class BIBankRepository implements BankRepository {
  store: Map<string, string>;

  constructor(
    @inject(AggregationIdentifier.bankMapper)
    private readonly bankMapper: BankMapper,
    private readonly biConnectionService: BIConnectionService,
  ) {
    this.store = new Map();
  }

  async getAll(): Promise<Bank[]> {
    const result = await this.biConnectionService.getAllConnectors();
    const { connectors } = result;
    const unrestritedConnectos: BIConnector[] = this.filterUnrestrictedConnector(connectors);
    const connectorsMatchRightAccountTypes = this.filterConnectorByAccountTypes(
      unrestritedConnectos,
      selectedAccountTypes,
    );
    return connectorsMatchRightAccountTypes
      .map(connector => this.bankMapper.toDomain(connector))
      .filter(connector => connector);
  }

  filterUnrestrictedConnector(connectors: BIConnector[]): BIConnector[] {
    return connectors.filter(connector => connector.restricted !== true);
  }

  filterConnectorByAccountTypes(connectors: BIConnector[], filterAccountTypes: string[]): BIConnector[] {
    return connectors.filter(
      connector =>
        connector.account_types &&
        connector.account_types.some(accountType => filterAccountTypes.includes(accountType)),
    );
  }

  async getById(id: string): Promise<Bank> {
    try {
      const result = await this.biConnectionService.getConnectorById(id);
      return this.bankMapper.toDomain(result);
    } catch (e) {
      /* istanbul ignore next: waiting for istanbul to support typescript optional chaining operator, same below */
      const errorCause = e?.response?.data;
      defaultLogger.error('@oney/aggregation.BIBankRepository.getById.catch', errorCause);
      throw new BankError.BankNotFound();
    }
  }
}
