import { ExpressAuthenticationMiddleware } from '@oney/common-adapters';
import {
  CreateBankAccount,
  GetBalance,
  UpdateBankAccount,
  GetBankAccount,
  CreateBeneficiary,
  GetBankIdentityStatement,
} from '@oney/payment-core';
import { CanExecuteResultEnum, VerifySca } from '@oney/identity-core';
import { Response } from 'express';
import * as httpStatus from 'http-status';
import { injectable } from 'inversify';
import { Get, JsonController, Param, Res, UseBefore, Patch, Body, Req, Post } from 'routing-controllers';
import { UserMiddleware } from '../../../server/config/middlewares/UserMiddleware';
import { AuthentifiedRequest } from '../../../server/config/middlewares/types/AuthentifiedRequest';
import { BasicAuthMiddleware } from '../middlewares/BasicAuthMiddleware';
import { CreateBankAccountCommand } from '../commands/CreateBankAccountCommand';
import { UpdateAccountCommand } from '../commands/UpdateAccountCommand';
import { BankAccountMapper } from '../mappers/BankAccountMapper';
import { CreateBeneficiaryCommand } from '../commands/createBeneficiaryCommand';

@JsonController('/user')
@injectable()
export class UserController {
  constructor(
    private readonly _getBalance: GetBalance,
    private readonly _getBankAccount: GetBankAccount,
    private readonly updateBankAccount: UpdateBankAccount,
    private readonly _createBankAccount: CreateBankAccount,
    private readonly _createBeneficiary: CreateBeneficiary,
    private readonly _bankAccountMapper: BankAccountMapper,
    private readonly _getBankIdentityStatement: GetBankIdentityStatement,
    private readonly _verifySca: VerifySca,
  ) {}

  @UseBefore(ExpressAuthenticationMiddleware, UserMiddleware)
  @Get('/:uid/balance')
  async getUserAccountBalance(@Param('uid') userId: string, @Res() res: Response): Promise<Response> {
    const accountBalance = await this._getBalance.execute({ uid: userId });

    return res.status(httpStatus.OK).send({
      balance: accountBalance.balance,
    });
  }

  @UseBefore(ExpressAuthenticationMiddleware)
  @Get('/:uid/bankaccount')
  async getUserBankAccount(
    @Param('uid') userId: string,
    @Res() res: Response,
    @Req() req: AuthentifiedRequest,
  ): Promise<Response> {
    const isAuthorized = await this._getBankAccount.canExecute(req.user, { uid: userId });
    if (!isAuthorized) {
      return res.sendStatus(401);
    }
    const bankAccount = await this._getBankAccount.execute({ uid: userId });
    const bankAccountDTO = this._bankAccountMapper.fromDomain(bankAccount);
    return res.status(httpStatus.OK).send(bankAccountDTO);
  }

  @UseBefore(BasicAuthMiddleware)
  @Patch('/:uid')
  async processUpdateAccount(
    @Body() cmd: UpdateAccountCommand,
    @Param('uid') uid: string,
    @Res() res: Response,
  ): Promise<Response> {
    const { phone, fiscalReference, declarativeFiscalSituation } = UpdateAccountCommand.setProperties(cmd);
    const payload = { declarativeFiscalSituation, fiscalReference, phone, uid };

    await this.updateBankAccount.execute(payload);
    return res.sendStatus(httpStatus.OK);
  }

  @UseBefore(ExpressAuthenticationMiddleware)
  @Post('/:uid')
  async createBankAccount(
    @Req() req: AuthentifiedRequest,
    @Res() res: Response,
    @Param('uid') uid: string,
    @Body() cmd: CreateBankAccountCommand,
  ): Promise<Response> {
    const isAuthorize = this._createBankAccount.canExecute(req.user);
    if (!isAuthorize) {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    const body = CreateBankAccountCommand.setProperties(cmd);
    const bankAccount = await this._createBankAccount.execute({
      uid: uid,
      ...body,
    });
    const bankAccountDto = this._bankAccountMapper.fromDomain(bankAccount);
    return res.status(httpStatus.CREATED).send(bankAccountDto);
  }

  @UseBefore(ExpressAuthenticationMiddleware)
  @Post('/:uid/beneficiary')
  async createBeneficiary(
    @Req() req: AuthentifiedRequest,
    @Res() res: Response,
    @Param('uid') uid: string,
    @Body() cmd: CreateBeneficiaryCommand,
  ): Promise<Response> {
    const sca = await this._createBeneficiary.canExecute(req.user, {
      uid,
      bic: cmd.bic,
      name: cmd.name,
      email: cmd.email,
      iban: cmd.iban,
    });
    if (sca.result === CanExecuteResultEnum.SCA_NEEDED) {
      await this._verifySca.execute({
        action: {
          payload: sca.scaPayload.payload,
          type: sca.scaPayload.actionType,
        },
        identity: req.user,
      });
    }

    const body = CreateBeneficiaryCommand.setProperties(cmd);
    const beneficiaryProperties = await this._createBeneficiary.execute({
      uid: uid,
      ...body,
    });

    return res.status(httpStatus.CREATED).send(beneficiaryProperties);
  }

  @UseBefore(ExpressAuthenticationMiddleware)
  @Get('/:uid/bis')
  async getBankIdentityStatement(
    @Req() req: AuthentifiedRequest,
    @Res() res: Response,
    @Param('uid') uid: string,
  ): Promise<Response> {
    const isAuthorized = this._getBankIdentityStatement.canExecute(req.user);
    if (!isAuthorized) {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    const bankIdentityStatement = await this._getBankIdentityStatement.execute({
      uid: uid,
    });

    res.set('Content-Type', 'application/pdf');
    return res.status(httpStatus.OK).send(bankIdentityStatement);
  }
}
