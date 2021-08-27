import * as _ from 'lodash';
import { Response } from 'express';
import { DomainError } from '@oney/common-core';
import { ExpressAuthenticationMiddleware } from '@oney/common-adapters';
import { Get, Params, Req, Res, UseBefore, UseAfter, JsonController } from 'routing-controllers';
import {
  GetAllBankAccounts,
  GetAllTransactions,
  GetTransactionById,
  GetTransactionsByAccountId,
  GetListAccountStatements,
  GetOneAccountStatement,
  GetAllBankAccountsCommands,
} from '@oney/pfm-core';
import * as httpStatus from 'http-status';
import { injectable } from 'inversify';
import { TransactionMapper } from './mappers/TransactionMapper';
import { BankAccountMapper } from './mappers/BankAccountMapper';
import {
  UserIdParams,
  UserAndAccountParams,
  UserAndTransactionParams,
  UserAndAccountStatementParams,
} from './commands';
import { UserDomainErrorMiddleware, UserMiddleware } from './middlewares';
import { AuthentifiedRequest } from '../../config/middlewares/types/AuthentifiedRequest';

export namespace UserError {
  export class WrongUserId extends DomainError {
    // eslint-disable-next-line
    constructor(cause?: any) {
      super('WRONG_USER_ID', cause);
    }
  }
}

@UseAfter(UserDomainErrorMiddleware)
@UseBefore(ExpressAuthenticationMiddleware)
@JsonController('/users/:userId')
@injectable()
export class UserController {
  constructor(
    //Usecases
    private readonly _getAllBankAccounts: GetAllBankAccounts,
    private readonly _getAllTransactions: GetAllTransactions,
    private readonly _getTransactionById: GetTransactionById,
    private readonly _getTransactionsByAccountId: GetTransactionsByAccountId,
    private readonly _getListAccountStatements: GetListAccountStatements,
    private readonly _getOneAccountStatement: GetOneAccountStatement,
    //Mappers
    private readonly _bankAccountMapper: BankAccountMapper,
    private readonly _transactionMapper: TransactionMapper,
  ) {}

  parseUserTokenFromHeaders(req: AuthentifiedRequest): string {
    const { authorization } = req.headers;
    return authorization.split(/\s+/g)[1];
  }

  @UseBefore(UserMiddleware)
  @Get('/accounts')
  async getAllBanksAccount(
    @Params() params: UserIdParams,
    @Req() req: AuthentifiedRequest,
    @Res() res: Response,
  ): Promise<Response> {
    const { userId } = params;
    const userToken = this.parseUserTokenFromHeaders(req);
    const getAllBankAccountsCommands: GetAllBankAccountsCommands = {
      userToken,
      userId,
    };

    this._getAllBankAccounts.canExecute(req.user);

    const results = await this._getAllBankAccounts.execute(getAllBankAccountsCommands);
    const formattedResults = results.map(a => this._bankAccountMapper.fromDomain(a));
    return res.status(httpStatus.OK).send(formattedResults);
  }

  @UseBefore(UserMiddleware)
  @Get('/transactions')
  async getAllTransactions(
    @Params() params: UserIdParams,
    @Req() req: AuthentifiedRequest,
    @Res() res: Response,
  ): Promise<Response> {
    this._getAllTransactions.canExecute(req.user);

    const { userId } = params;
    const userToken = this.parseUserTokenFromHeaders(req);
    const getAllTransactionsCommand = {
      userToken,
      userId,
      query: _.pick(req.query, ['dateFrom', 'dateTo', 'sortBy', 'transactionSources']),
    };
    const results = await this._getAllTransactions.execute(getAllTransactionsCommand);
    const formattedResults = results.map(t => this._transactionMapper.fromDomain(t));
    return res.status(httpStatus.OK).send(formattedResults);
  }

  @UseBefore(UserMiddleware)
  @Get('/transactions/:transactionId')
  async getTransactionsById(
    @Params() params: UserAndTransactionParams,
    @Req() req: AuthentifiedRequest,
    @Res() res: Response,
  ): Promise<Response> {
    this._getTransactionById.canExecute(req.user);

    const { userId, transactionId } = params;
    const userToken = this.parseUserTokenFromHeaders(req);

    const getTransactionsCommand = {
      userId,
      userToken,
      transactionId,
    };
    const result = await this._getTransactionById.execute(getTransactionsCommand);
    const formattedResult = this._transactionMapper.fromDomain(result);
    return res.status(httpStatus.OK).send(formattedResult);
  }

  @UseBefore(UserMiddleware)
  @Get('/accounts/:accountId/transactions')
  async getTransactionsByAccountId(
    @Params() params: UserAndAccountParams,
    @Req() req: AuthentifiedRequest,
    @Res() res: Response,
  ): Promise<Response> {
    this._getTransactionsByAccountId.canExecute(req.user);

    const { userId, accountId } = params;
    const { query } = req;
    const userToken = this.parseUserTokenFromHeaders(req);
    const getTransactionsCommand =
      Object.keys(query).length > 0
        ? {
            userToken,
            userId,
            accountId,
            query,
          }
        : {
            userToken,
            userId,
            accountId,
          };
    const results = await this._getTransactionsByAccountId.execute(getTransactionsCommand);
    const formattedResults = results.map(t => this._transactionMapper.fromDomain(t));
    return res.status(httpStatus.OK).send(formattedResults);
  }

  @UseBefore(UserMiddleware)
  @Get('/account_statements')
  async getAllAccountStatements(
    @Params() params: UserIdParams,
    @Res() res: Response,
    @Req() req: AuthentifiedRequest,
  ): Promise<Response> {
    this._getListAccountStatements.canExecute(req.user);

    const { userId } = params;
    const GetListAccountStatementsCommands = {
      userId,
    };

    const result = await this._getListAccountStatements.execute(GetListAccountStatementsCommands);
    const sorted = result.sort((a, b) => b.date.getTime() - a.date.getTime());
    return res.status(httpStatus.OK).send(sorted);
  }

  @UseBefore(UserMiddleware)
  @Get('/account_statements/:accountStatementId')
  async getOneAccountStatement(
    @Params() params: UserAndAccountStatementParams,
    @Res() res: Response,
    @Req() req: AuthentifiedRequest,
  ): Promise<Response> {
    this._getOneAccountStatement.canExecute(req.user);

    const { userId, accountStatementId } = params;
    const GetAccountStatementCommands = {
      userId,
      accountStatementId,
    };

    const file = await this._getOneAccountStatement.execute(GetAccountStatementCommands);

    res.set('Content-Type', 'application/pdf');
    return res.send(file);
  }
}
