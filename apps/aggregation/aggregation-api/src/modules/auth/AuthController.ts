import { SignIn, CompleteSignInWithSca } from '@oney/aggregation-core';
import { ExpressAuthenticationMiddleware } from '@oney/common-adapters';
import { Response } from 'express';
import * as httpStatus from 'http-status';
import { injectable } from 'inversify';
import { Post, JsonController, Res, Body, Req, UseBefore } from 'routing-controllers';
import { SignInCommand, ScaCommand } from './commands';
import { AuthentifiedRequest } from '../middlewares/types';
import { BankConnectionMapper } from '../user/mappers/BankConnectionMapper';

@JsonController('/auth')
@UseBefore(ExpressAuthenticationMiddleware)
@injectable()
export class AuthController {
  constructor(
    private readonly _signIn: SignIn,
    private readonly _completeSignInWithSca: CompleteSignInWithSca,
    private readonly bankConnectionMapper: BankConnectionMapper,
  ) {}

  @Post('/signin')
  async signIn(
    @Req() { user }: AuthentifiedRequest,
    @Body() cmd: SignInCommand,
    @Res() res: Response,
  ): Promise<Response> {
    await this._signIn.canExecute(user);
    const body = SignInCommand.setProperties(cmd);
    const bankConnection = await this._signIn.execute({
      ...body,
      userId: user.uid,
    });
    const bankConnectionsDto = this.bankConnectionMapper.fromDomain(bankConnection);
    return res.status(httpStatus.OK).send(bankConnectionsDto);
  }

  @Post('/sca')
  async completeSignInWithSca(
    @Req() { user }: AuthentifiedRequest,
    @Body() cmd: ScaCommand,
    @Res() res: Response,
  ): Promise<Response> {
    await this._completeSignInWithSca.canExecute(user);
    const body = ScaCommand.setProperties(cmd);
    const bankConnection = await this._completeSignInWithSca.execute({
      ...body,
      userId: user.uid,
    });
    const bankConnectionsDto = this.bankConnectionMapper.fromDomain(bankConnection);
    return res.status(httpStatus.OK).send(bankConnectionsDto);
  }
}
