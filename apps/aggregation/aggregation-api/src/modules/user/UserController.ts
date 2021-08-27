import {
  GetConnectionsOwnedByUser as GetAllBankConnections,
  GetConnectionById,
  GetAccountsByConnectionId,
  AggregateAccounts,
  GetAllBankAccounts,
  TriggerSca,
  GetTransactionsByConnectionId,
  GetAllTransactions,
  PostAllTransactions,
  GetCategorizedTransactions,
  GetUserCreditProfile,
  DeleteBankConnection,
  UpdateConnection,
  SaveUserConsent,
  CheckUserConsent,
} from '@oney/aggregation-core';
import { ExpressAuthenticationMiddleware } from '@oney/common-adapters';
import { Response } from 'express';
import * as httpStatus from 'http-status';
import { injectable } from 'inversify';
import { Get, JsonController, UseBefore, Req, Res, Param, Post, Body, Delete } from 'routing-controllers';
import { AggregateAccountsCommand, SaveUserConsentCommand, UpdateConnectionCommand } from './commands';
import { BankAccountMapper } from './mappers/BankAccountMapper';
import { BankConnectionMapper } from './mappers/BankConnectionMapper';
import { PP2ReveTransactionMapper } from './mappers/PP2ReveTransactionMapper';
import { TransactionMapper } from './mappers/TransactionMapper';
import { UserMapper } from './mappers/UserMapper';
import { UserMiddleware } from './middlewares';
import { AuthentifiedRequest } from '../middlewares/types';

@JsonController('/users/:userId')
@UseBefore(ExpressAuthenticationMiddleware)
@injectable()
export class UserController {
  constructor(
    private readonly _getAllBankConnections: GetAllBankConnections,
    private readonly _getBankConnectionById: GetConnectionById,
    private readonly _getAccountsByConnectionId: GetAccountsByConnectionId,
    private readonly _aggregateAccounts: AggregateAccounts,
    private readonly _getAllBankAccounts: GetAllBankAccounts,
    private readonly _getTransactionsByConnectionId: GetTransactionsByConnectionId,
    private readonly _getAllTransactions: GetAllTransactions,
    private readonly _postAllTransactions: PostAllTransactions,
    private readonly _getCategorizedTransactions: GetCategorizedTransactions,
    private readonly _getUserCreditProfile: GetUserCreditProfile,
    private readonly _deleteBankConnection: DeleteBankConnection,
    private readonly _triggerSca: TriggerSca,
    private readonly _updateConnection: UpdateConnection,
    private readonly _saveUserConsent: SaveUserConsent,
    private readonly _checkUserConsent: CheckUserConsent,
    private readonly bankConnectionMapper: BankConnectionMapper,
    private readonly bankAccountMapper: BankAccountMapper,
    private readonly pP2ReveTransactionMapper: PP2ReveTransactionMapper,
    private readonly transactionMapper: TransactionMapper,
    private readonly userMapper: UserMapper,
  ) {}

  @UseBefore(UserMiddleware)
  @Get('/connections')
  async getAllBankConnections(@Req() { user }: AuthentifiedRequest, @Res() res: Response): Promise<Response> {
    await this._getAllBankConnections.canExecute(user);
    const { bankConnections, banks } = await this._getAllBankConnections.execute({ userId: user.uid });
    const bankConnectionsDto = bankConnections
      .map(bankConnection => {
        const bank = banks.find(bank => bank.uid === bankConnection.props.bankId);
        return this.bankConnectionMapper.fromDomainWithBankAndAccount({ bankConnection, bank });
      })
      .filter(aBankConnection => aBankConnection);
    return res.status(httpStatus.OK).send({ connections: bankConnectionsDto });
  }

  @UseBefore(UserMiddleware)
  @Get('/connections/:connectionId')
  async getConnectionById(
    @Req() { user }: AuthentifiedRequest,
    @Res() res: Response,
    @Param('connectionId') connectionId: string,
  ): Promise<Response> {
    await this._getBankConnectionById.canExecute(user);
    const bankConnection = await this._getBankConnectionById.execute({ userId: user.uid, connectionId });
    const bankConnectionsDto = this.bankConnectionMapper.fromDomain(bankConnection);
    return res.status(httpStatus.OK).send(bankConnectionsDto);
  }

  @UseBefore(UserMiddleware)
  @Get('/connections/:connectionId/accounts')
  async getAccountsByConnectionId(
    @Req() { user }: AuthentifiedRequest,
    @Res() res: Response,
    @Param('connectionId') connectionId: string,
  ): Promise<Response> {
    await this._getAccountsByConnectionId.canExecute(user);
    const { bankAccounts } = await this._getAccountsByConnectionId.execute({
      userId: user.uid,
      connectionId,
    });
    const bankAccountsDto = {
      accounts: bankAccounts.map(account => this.bankAccountMapper.fromDomain(account)),
    };
    return res.status(httpStatus.OK).send(bankAccountsDto);
  }

  @UseBefore(UserMiddleware)
  @Post('/connections/:connectionId/accounts')
  async aggregateAccounts(
    @Req() { user }: AuthentifiedRequest,
    @Body() cmd: AggregateAccountsCommand,
    @Res() res: Response,
    @Param('connectionId') connectionId: string,
  ): Promise<Response> {
    await this._aggregateAccounts.canExecute(user);
    const body = AggregateAccountsCommand.setProperties(cmd);
    const bankAccounts = await this._aggregateAccounts.execute({ userId: user.uid, connectionId, ...body });
    const bankAccountsDto = bankAccounts.map(account => this.bankAccountMapper.fromDomain(account));
    return res.status(httpStatus.OK).send(bankAccountsDto);
  }

  @UseBefore(UserMiddleware)
  @Get('/accounts')
  async getAllBanksAccount(@Req() { user }: AuthentifiedRequest, @Res() res: Response): Promise<Response> {
    await this._getAllBankAccounts.canExecute(user);
    const { bankAccounts, banks } = await this._getAllBankAccounts.execute({ userId: user.uid });
    const bankAccountsDto = bankAccounts.map(account => {
      const bank = banks.find(bank => bank.uid === account.props.bankId);
      return this.bankAccountMapper.fromDomainWithBank({ bankAccount: account, bank });
    });
    const sortedBankAccountsDto = bankAccountsDto.sort((accountA, accountB) =>
      accountA.name.localeCompare(accountB.name),
    );
    return res.status(httpStatus.OK).send(sortedBankAccountsDto);
  }

  @UseBefore(UserMiddleware)
  @Post('/connections/:connectionId')
  async triggerSca(
    @Req() { user }: AuthentifiedRequest,
    @Res() res: Response,
    @Param('connectionId') connectionId: string,
    @Body() cmd: UpdateConnectionCommand,
  ): Promise<Response> {
    const { bankId, form } = cmd;
    if (bankId && form) {
      const body = UpdateConnectionCommand.setProperties(cmd);
      const bankConnection = await this._updateConnection.execute({
        ...body,
        userId: user.uid,
        connectionId,
      });
      const bankConnectionsDto = this.bankConnectionMapper.fromDomain(bankConnection);
      return res.status(httpStatus.OK).send(bankConnectionsDto);
    }
    await this._triggerSca.canExecute(user);
    const bankConnection = await this._triggerSca.execute({ userId: user.uid, connectionId });
    const bankConnectionsDto = this.bankConnectionMapper.fromDomain(bankConnection);

    return res.status(httpStatus.OK).send(bankConnectionsDto);
  }

  @UseBefore(UserMiddleware)
  @Get('/connections/:connectionId/transactions')
  async getTransactionsByConnectionId(
    @Req() { user }: AuthentifiedRequest,
    @Res() res: Response,
    @Param('connectionId') connectionId: string,
  ): Promise<Response> {
    await this._getTransactionsByConnectionId.canExecute(user);
    const { bankAccounts, bankConnection } = await this._getTransactionsByConnectionId.execute({
      userId: user.uid,
      connectionId,
    });
    const result = bankAccounts.map(bankAccount =>
      this.pP2ReveTransactionMapper.fromDomain({ bankAccount, bankConnection }),
    );
    return res.status(httpStatus.OK).send(result);
  }

  @UseBefore(UserMiddleware)
  @Delete('/connections/:connectionId')
  async deleteBankConnection(
    @Req() { user }: AuthentifiedRequest,
    @Res() res: Response,
    @Param('connectionId') connectionId: string,
  ): Promise<Response> {
    await this._deleteBankConnection.canExecute(user);
    await this._deleteBankConnection.execute({ userId: user.uid, connectionId });
    return res.status(httpStatus.OK).send({ connectionId });
  }

  // endpoints below are reserved to PP2reve
  @UseBefore(UserMiddleware)
  @Get('/transactions')
  async getAllTransactions(@Req() { user }: AuthentifiedRequest, @Res() res: Response): Promise<Response> {
    await this._getAllTransactions.canExecute(user);

    const { bankAccounts, bankConnections } = await this._getAllTransactions.execute({
      userId: user.uid,
    });
    const result = bankAccounts.map(bankAccount => {
      const bankConnection = bankConnections.find(
        bankConnection => bankConnection.props.connectionId === bankAccount.props.connectionId,
      );
      return this.pP2ReveTransactionMapper.fromDomain({ bankAccount, bankConnection });
    });
    return res.status(httpStatus.OK).send(result);
  }

  @UseBefore(UserMiddleware)
  @Post('/transactions')
  async postAllTransactions(@Req() { user }: AuthentifiedRequest, @Res() res: Response): Promise<Response> {
    await this._postAllTransactions.canExecute(user);
    const userDomain = await this._postAllTransactions.execute({
      userId: user.uid,
    });
    const userWithCreditDecisioningDataDto = this.userMapper.fromDomainWithCreditDecioningData(userDomain);
    return res.status(httpStatus.OK).send(userWithCreditDecisioningDataDto);
  }

  @UseBefore(UserMiddleware)
  @Get('/categorized-transaction-aggregate')
  async getCategorizedTransactionAggregate(
    @Req() { user }: AuthentifiedRequest,
    @Res() res: Response,
  ): Promise<Response> {
    await this._getCategorizedTransactions.canExecute(user);
    const categorizedTransactions = await this._getCategorizedTransactions.execute({
      userId: user.uid,
    });
    const categorizedTransactionsDto = categorizedTransactions.map(aTransaction =>
      this.transactionMapper.fromDomain(aTransaction),
    );
    return res.status(httpStatus.OK).send(categorizedTransactionsDto);
  }

  @UseBefore(UserMiddleware)
  @Get('/credit-profile')
  async getUserCreditProfile(@Req() { user }: AuthentifiedRequest, @Res() res: Response): Promise<Response> {
    await this._getUserCreditProfile.canExecute(user);
    const creditProfile = await this._getUserCreditProfile.execute({ userId: user.uid });
    return res.status(httpStatus.OK).send(creditProfile);
  }

  @UseBefore(UserMiddleware)
  @Post('/consent')
  async saveUserConsent(
    @Req() { user }: AuthentifiedRequest,
    @Body() cmd: SaveUserConsentCommand,
    @Res() res: Response,
  ): Promise<Response> {
    await this._saveUserConsent.canExecute(user);
    const { consent } = SaveUserConsentCommand.setProperties(cmd);
    const bankAccountOwner = await this._saveUserConsent.execute({ userId: user.uid, consent });
    const bankAccountOwnerDto = this.userMapper.fromDomain(bankAccountOwner);
    return res.status(httpStatus.OK).send(bankAccountOwnerDto);
  }

  @UseBefore(UserMiddleware)
  @Get('/consent')
  async checkUserConsent(@Req() { user }: AuthentifiedRequest, @Res() res: Response): Promise<Response> {
    await this._checkUserConsent.canExecute(user);
    const bankAccountOwner = await this._checkUserConsent.execute({ userId: user.uid });
    const bankAccountOwnerDto = this.userMapper.fromDomain(bankAccountOwner);
    return res.status(httpStatus.OK).send(bankAccountOwnerDto);
  }
}
