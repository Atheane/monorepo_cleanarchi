import { defaultLogger } from '@oney/logger-adapters';
import { inject, injectable } from 'inversify';
import {
  ISigninField,
  AggregationIdentifier,
  BankConnectionGateway,
  IdGenerator,
  BankConnection,
  BankConnectionError,
  BankConnectionRepository,
} from '@oney/aggregation-core';
import { BankConnectionMapper } from '../mappers/BankConnectionMapper';
import { BIConnectionService } from '../partners/budgetinsights/BIConnectionService';
import { BIConnectionBoosted, BIConnectionError } from '../partners/budgetinsights/models/Connection';

@injectable()
export class BIBankConnectionGateway implements BankConnectionGateway {
  constructor(
    @inject(AggregationIdentifier.bankConnectionMapper)
    private readonly bankConnectionMapper: BankConnectionMapper,
    @inject(AggregationIdentifier.idGenerator) private readonly idGenerator: IdGenerator,
    @inject(AggregationIdentifier.bankConnectionRepository)
    private readonly bankConnectionRepository: BankConnectionRepository,
    private readonly biConnectionService: BIConnectionService,
  ) {}

  async askConnection(bankId: string, userId: string, signInFields: ISigninField[]): Promise<BankConnection> {
    try {
      const body = { connector_uuid: bankId };
      signInFields.forEach(signInField => {
        body[signInField.name] = signInField.value;
      });
      const connectionId = this.idGenerator.generateUniqueID();
      const result = await this.biConnectionService.postConnection(body);
      const biConnectionBoosted: BIConnectionBoosted = { connectionId, userId, connection: result };
      return this.bankConnectionMapper.toDomain(biConnectionBoosted);
    } catch (e) {
      /* istanbul ignore next: waiting for istanbul to support typescript optional chaining operator */
      const responseData = e?.response?.data;
      defaultLogger.error('@oney/aggregation.BIBankConnectionGateway.askConnection.catch', responseData);

      // if user try to signin when connection is at decoupled state, BI throw an error
      // we need to catch it and return bankConnection at decoupled state
      if (
        responseData.code === BIConnectionError.BAD_REQUEST &&
        responseData.description.includes('resume parameter')
      ) {
        const isDigit = /(\d+)/g;
        const refId = responseData.description.match(isDigit)[0];
        const connection = await this.bankConnectionRepository.findBy({ refId });
        return connection;
      }

      switch (responseData.code) {
        case BIConnectionError.WRONG_PASS:
          throw new BankConnectionError.WrongPassword(responseData);
        case BIConnectionError.PASSWORD_EXPIRED:
          throw new BankConnectionError.WrongPassword(responseData);
        case BIConnectionError.ACTION_NEEDED:
          throw new BankConnectionError.ActionNeeded(responseData);
        default:
          throw new BankConnectionError.ApiResponseError(responseData);
      }
    }
  }

  async updateConnection({
    bankConnection,
    form,
  }: {
    bankConnection: BankConnection;
    form: ISigninField[];
  }): Promise<BankConnection> {
    const { bankId, refId, connectionId, userId } = bankConnection.props;
    try {
      const body = { connector_uuid: bankId };
      form.forEach(signInField => {
        body[signInField.name] = signInField.value;
      });
      const result = await this.biConnectionService.postSca(refId, body);
      const biConnectionBoosted: BIConnectionBoosted = { connectionId, userId, connection: result };
      return this.bankConnectionMapper.toDomain(biConnectionBoosted);
    } catch (e) {
      /* istanbul ignore next: waiting for istanbul to support typescript optional chaining operator */
      const responseData = e?.response?.data;
      defaultLogger.error('@oney/aggregation.BIBankConnectionGateway.updateConnection.catch', responseData);

      switch (responseData.code) {
        case BIConnectionError.WRONG_PASS:
          throw new BankConnectionError.WrongPassword(responseData);
        case BIConnectionError.PASSWORD_EXPIRED:
          throw new BankConnectionError.WrongPassword(responseData);
        case BIConnectionError.ACTION_NEEDED:
          throw new BankConnectionError.ActionNeeded(responseData);
        default:
          throw new BankConnectionError.ApiResponseError(responseData);
      }
    }
  }

  async deleteOne(refId: string): Promise<void> {
    await this.biConnectionService.deleteBankConnection(refId);
  }
}
