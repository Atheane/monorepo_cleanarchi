import { defaultLogger } from '@oney/logger-adapters';
import { inject, injectable } from 'inversify';
import {
  ScaConnectionGateway,
  ISigninField,
  BankConnection,
  AggregationIdentifier,
  BankConnectionError,
} from '@oney/aggregation-core';
import { BankConnectionMapper } from '../mappers/BankConnectionMapper';
import { ConnectionStateMapper } from '../mappers/ConnectionStateMapper';
import { BIConnectionService } from '../partners/budgetinsights/BIConnectionService';
import { BIConnectionBoosted, BIConnectionError } from '../partners/budgetinsights/models/Connection';
import { PP2ReveConnectionService } from '../partners/pp2Reve/PP2ReveConnectionService';

@injectable()
export class BIScaConnectionGateway implements ScaConnectionGateway {
  constructor(
    @inject(AggregationIdentifier.bankConnectionMapper)
    private readonly bankConnectionMapper: BankConnectionMapper,
    @inject(AggregationIdentifier.connectionStateMapper)
    private readonly connectionStateMapper: ConnectionStateMapper,
    private readonly biConnectionService: BIConnectionService,
    private readonly pp2ReveConnectionService: PP2ReveConnectionService,
  ) {}

  async authenticateOtp(connection: BankConnection, form: ISigninField[]): Promise<BankConnection> {
    try {
      const body = {};
      form.forEach(obj => {
        body[obj.name] = obj.value;
      });
      const result = await this.biConnectionService.postSca(connection.props.refId, body);
      const { connectionId, userId } = connection.props;
      const biConnectionBoosted: BIConnectionBoosted = { connectionId, userId, connection: result };
      return this.bankConnectionMapper.toDomain(biConnectionBoosted);
    } catch (e) {
      /* istanbul ignore next: waiting for istanbul to support typescript optional chaining operator */
      const responseData = e?.response?.data;
      defaultLogger.error('@oney/aggregation.BIScaConnectionGateway.authenticateOtp.catch', responseData);
      if (responseData.code === BIConnectionError.WRONG_PASS) {
        throw new BankConnectionError.WrongPassword(responseData);
      }
      throw new BankConnectionError.ApiResponseError(responseData);
    }
  }

  async authenticateThirdParty(connection: BankConnection): Promise<BankConnection> {
    const { refId, connectionId, userId } = connection.props;
    const body = {
      resume: true,
    };
    try {
      const result = await this.biConnectionService.postSca(refId, body);
      return this.bankConnectionMapper.toDomain({
        connectionId,
        userId,
        connection: result,
      });
    } catch (e) {
      /* istanbul ignore next: waiting for istanbul to support typescript optional chaining operator */
      const responseData = e?.response?.data;
      defaultLogger.error(
        '@oney/aggregation.BIScaConnectionGateway.authenticateThirdParty.catch',
        responseData,
      );
      return new BankConnection({
        ...connection.props,
        state: this.connectionStateMapper.toDomain(responseData.code),
      });
    }
  }

  async triggerSca(connection: BankConnection): Promise<BankConnection> {
    const { refId, connectionId, userId } = connection.props;
    const body = {};
    try {
      const result = await this.biConnectionService.postSca(refId, body);
      return this.bankConnectionMapper.toDomain({
        connectionId,
        userId,
        connection: result,
      });
    } catch (e) {
      /* istanbul ignore next: waiting for istanbul to support typescript optional chaining operator */
      const responseData: string = e?.response?.data;
      defaultLogger.error('@oney/aggregation.BIScaConnectionGateway.triggerSca.catch', responseData);
      throw new BankConnectionError.ApiResponseError(responseData);
    }
  }

  async postScaResult(bankConnection: BankConnection, urlCallBack: string): Promise<void> {
    try {
      this.pp2ReveConnectionService.setUp(urlCallBack);
      await this.pp2ReveConnectionService.postScaResult(bankConnection.props);
    } catch (e) {
      defaultLogger.error('PP-2-REVE sca post on urlcallback failed', e);
    }
  }
}
